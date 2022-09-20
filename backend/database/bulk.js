////////////////////////////////////
////  NEO4J BULK WRITE SCRIPT  ////
///////////////////////////////////

//Convention
let metaDataDelimiter = ',';
let mutualRankDelimiter = ',';
let correlationDelimiter = ',';
//Neo4j Remote Configuration //Linode
let neo4jUser = "neo4j";
let neo4jPassword = "";
let neo4jConnectionString = "bolt://localhost:7687";
//Upload configuration
let neo4jDatabase = "scersrag0";
//Files Configuration
let metadataFileURL = "./allmeta_combined_yeast.csv";
let mutualrankFileURL = "./mutual_rank_matrix_saccharomyces_cerevisiae.tsv";
let correlationFileURL = "./correlation_matrix_saccharomyces_cerevisiae.tsv";


//////////////////////////////////////////////////////////////

let fs = require('fs');
const readline = require('readline');
const EventEmitter = require('events')
let { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
let neo4j = require('neo4j-driver');
let driver = neo4j.driver(
    neo4jConnectionString,
    neo4j.auth.basic(neo4jUser, neo4jPassword)
)

/////////////////
////  TO-DO  ////
/////////////////
// Feel free of comment whatever you will not use
async function bulkWriteData() {
    console.log("Start")
    //await doDatabase();
    //await doIndexes();
    //await doMetadata();
    //await doMRandCo()
    await doPrecomputeFandE();

    console.log("All tasks ended")

}

////////////////////////////////////////////////////////////////////////////////////
/// Logic Functions, please do not touch if you don't know what are you doing :P ///
////////////////////////////////////////////////////////////////////////////////////

const nodeId = (input) => {
    var hash = 0, len = input.length;
    for (var i = 0; i < len; i++) {
      hash  = ((hash << 5) - hash) + input.charCodeAt(i);
      hash |= 0; // to 32bit integer
    }
    return parseInt(hash)
}

const edgeId = (n0, n1) => {
    let edgeidentifier = 0
    if (n0 < n1) {
        edgeidentifier = (n1) * (n1 - 1) / 2 + n0
    } else {
        edgeidentifier = (n0) * (n0 - 1) / 2 + n1
    }
    return edgeidentifier
}

const minorToMayor = (a, b) => a.mr - b.mr

function sendToWorker(data) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, { workerData: data });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
};

function doDatabase() {
    return new Promise(async resolve => {
        let session = driver.session({
            database: 'neo4j',
            defaultAccessMode: neo4j.session.WRITE
        })

        await session.run('CREATE DATABASE $dbname', {
            dbname: neo4jDatabase
        })
        console.log("Database created")
        resolve()
    })
}

function doIndexes() {
    return new Promise(async resolve => {
        let session = driver.session({
            database: neo4jDatabase,
            defaultAccessMode: neo4j.session.WRITE
        })

        await session.run(`CREATE INDEX geneNodes FOR (n:Gene) ON (n.nodeidentifier)`)

        console.log("Index created")
        resolve()
    })
}

function getHeadersFrom(path, delimiter) {

    return new Promise(resolve => {

        let stream = fs.createReadStream(path, { encoding: 'utf-8' })

        let rl = readline.createInterface(stream)

        rl.on('line', line => {
            let result = line.split(delimiter)
            rl.close()
            resolve(result)
        })
    })

}

function doMetadata() {

    return new Promise(async resolve => {

        let firstMD = true;
        let mdHeaders = [];
        let mrHeaders = await getHeadersFrom(mutualrankFileURL, mutualRankDelimiter)
        let result = []

        let session = driver.session({
            database: neo4jDatabase,
            defaultAccessMode: neo4j.session.WRITE
        })

        let stream = fs.createReadStream(metadataFileURL, { encoding: 'utf-8' })

        let rl = readline.createInterface(stream)

        rl.on('line', line => {
            rl.pause()

            if (firstMD) {
                firstMD = false;
                mdHeaders = line.split(metaDataDelimiter)
            }
            else {
                let data = line.split(metaDataDelimiter)
                let partialResult = {}
                for (let i = 0; i < mdHeaders.length; i++) {
                    partialResult[`${mdHeaders[i]}`] = data[i]
                }
                result.push(partialResult)
            }
            rl.resume()
        })
        rl.on('close', async () => {

            let filteredResult = result.filter(md => mrHeaders.includes(md.ensemblid))

            await session.writeTransaction(async txc => {
                for (const node of filteredResult) {
                    txc.run(`CREATE (:Gene { ensemblid : $ensemblid, nodeidentifier : $nodeidentifier, chromosomename : $chromosomename, start : $start, end : $end, symbol : $symbol, biotype : $biotype, annotation : $annotation })`, {
                        ensemblid: node?.ensemblid,
                        nodeidentifier: neo4j.int(nodeId(node?.ensemblid)),
                        chromosomename: (node?.chromosomename || 'NA'),
                        start: (node?.start || 0),
                        end: (node?.end || 0),
                        symbol: (node?.symbol || 'NA'),
                        biotype: (node?.biotype || 'NA'),
                        annotation: node?.annotation.trim()
                    })
                }
            })

            console.log("Metadata inserted correctly")

            resolve()
        })

    })
}

function doMRandCo() {
    console.log("MR and Co in progress");
    return new Promise(resolve => {
        const matcher = new EventEmitter();
        let counter = 0
        let firstMR = true;
        let firstCO = true;
        let headers = [];
        let matched = {}
        let total = 0;
        let finished = 0;
        let session = driver.session({
            database: neo4jDatabase,
            defaultAccessMode: neo4j.session.WRITE
        })

        function checkFillData() {
            return new Promise(async resolve => {
                counter++
                total++
                if (counter === 2) {
                    counter = 0

                    let { ensemblid, friends } = await sendToWorker({ headers, matched });
                    let sourceId = Number(nodeId(ensemblid));

                    await session.writeTransaction(async txc => {
                        for await (const friend of friends) {
                            let targetId = Number(nodeId(friend.id))
                            await txc.run(`MATCH (source:Gene), (target:Gene) WHERE source.nodeidentifier = $sourceid AND target.nodeidentifier = $targetid CREATE (source)-[:LIKE {edgeidentifier:$edgeid, mutualrank:$mr, correlation:$co}]->(target)`,
                                {
                                    sourceid: sourceId,
                                    targetid: targetId,
                                    edgeid: neo4j.int(edgeId(sourceId, targetId)),
                                    mr: Number(friend.mr),
                                    co: Number(friend.co)
                                })
                        }
                    })
                    matcher.emit('nextmr')
                    matcher.emit('nextco')
                }
                resolve(total)
            })
        }

        let cor = fs.createReadStream(correlationFileURL, { encoding: 'utf-8' })
        let mr = fs.createReadStream(mutualrankFileURL, { encoding: 'utf-8' })

        let corl = readline.createInterface(cor)
        let mrrl = readline.createInterface(mr)

        mrrl.on('line', async line => {
            mrrl.pause()
            matcher.on('nextmr', () => {
                matcher.removeAllListeners('nextmr')
                mrrl.resume()
            })
            let data = line.split(mutualRankDelimiter)
            if (firstMR) {
                headers = data
                firstMR = false
                matcher.emit('nextmr')
            }
            else {
                let id = data.shift();
                matched.mrs = { id, mr: data }
                await checkFillData()
            }
        })

        corl.on('line', async line => {
            corl.pause()
            matcher.on('nextco', () => {
                matcher.removeAllListeners('nextco')
                corl.resume()
            })
            let data = line.split(correlationDelimiter)
            if (firstCO) {
                firstCO = false
                matcher.emit('nextco')
            }
            else {
                let id = data.shift();
                matched.cos = { id, co: data }
                await checkFillData()
            }
        })

        mr.on('end', () => {
            finished++
            if (finished === 2) {
                resolve()
            }
        })
        cor.on('end', () => {
            finished++
            if (finished === 2) {
                resolve()
            }
        })
    })
}

function doPrecomputeFandE() {
    return new Promise(async resolve => {

        let session = driver.session({
            database: neo4jDatabase,
            defaultAccessMode: neo4j.session.WRITE
        })

        let processedFriends = [];

        console.log('Preprocessing friends')

        let friends = await session.run("MATCH (source:Gene)-[:LIKE*1..1]->(target:Gene) RETURN target.nodeidentifier as target, size(collect(target.nodeidentifier)) AS totalFriends")

        console.log("Re-estructuring data")

        friends.records.forEach(r => {
            let rMap = new Map()
            for (let i = 0; i < r.keys.length; i++) {
                rMap.set(r.keys[i], r._fields[i].low)
            }
            processedFriends.push(Object.fromEntries(rMap))
        })

        for await (const friend of processedFriends) {
            await session.run("MATCH (target:Gene) WHERE target.nodeidentifier = $sourceid SET target.totalFriends = $totalFriends",
                {
                    sourceid: friend.target,
                    totalFriends: neo4j.int(friend.totalFriends)
                })
        }

        console.log("Pre-computing of friends done and uploaded")
        resolve()
    })
}

if (isMainThread) {
    bulkWriteData(metadataFileURL, mutualrankFileURL, correlationFileURL)
}
else {

    const data = workerData;

    let entries = data.matched.mrs.mr.length;
    let result = {
        id: data.matched.mrs.id,
        data: []
    }
    for (let i = 0; i < entries; i++) {
        result.data.push({
            id: data.headers[i],
            co: data.matched.cos.co[i],
            mr: data.matched.mrs.mr[i]
        });
    }

    let fivePercent = Math.floor(entries * 5 / 100);

    let friends = result.data.sort(minorToMayor).filter(friend => result.id !== friend.id).slice(0, fivePercent)


    //if (result.id === friends[0].id) { throw new Error("Coinciden los IDs") }
    //if (friends[0].mr === '1') { throw new Error("Cuadr       el rango mutuo") }
    //if(friends[0].co === '1'){ throw new Error("Cuadr       la correlaci      n") }
    parentPort.postMessage({
        ensemblid: result.id,
        friends
    })

}