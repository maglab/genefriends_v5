const {
    ensemblid,
    nodeId,
    davidFetch,
    getDatabase,
    addPValue,
    filterAndSortingByCorrelation,
    processNeo4jQueryResult,
    getSpeciesForMyGene,
    geneIdConverter
} = require('../supportFunctionsBackend.js')

const express = require('express')
const router = express.Router()
const {
    neo4jGetSession
} = require('../configneo4j.js')
const axios = require("axios")
const { includes } = require('lodash')

router.get('/api/test', (req, res) => {
    res.json({ "status": "OK" })
})


const getObjectType = (_objectType) => {
    if (_objectType === 'G') {
        return 'ensembl.gene'
    } else {
        return 'ensembl.transcript'
    }
}

router.post('/api/validate', async (req, res) => {
    try {
        const neo4jsession = neo4jGetSession(getDatabase(req.body.species, req.body.dataSource, req.body.tissue))    //Create session for neo4j, where 'neo4j' is the name of database


        if (req.body.species == "ENS" || req.body.species == "ENSMUS") {
            let myGeneResult = await geneIdConverter(req.body.seedGenes, getSpeciesForMyGene(req.body.species), getObjectType(req.body.objectType))    //myGene

        
        if(req.body.objectType === "G") {
            myGeneResult = myGeneResult.map(gen => {
                return {
                    ensembl: Array.isArray(gen.ensembl) ? gen.ensembl.map(el => el?.gene) : [gen.ensembl?.gene],
                    query: gen.query
                };
            })
        } else {
            myGeneResult = myGeneResult.map(gen => {

                return {
                    ensembl: Array.isArray(gen.ensembl) ? gen.ensembl.map(el => el?.transcript[0]) : [
                        Array.isArray(gen.ensembl?.transcript) ? gen.ensembl?.transcript[0] : gen.ensembl?.transcript
                    ],
                    query: gen.query
                };
            })           
        }


            let included = []
            let excluded = []


            included = myGeneResult.filter(gen => gen?.ensembl?.every(el => el?.startsWith("ENS"))).concat(
                myGeneResult.filter(gen => gen?.query).filter(el => typeof el.ensembl[0] == 'undefined').map(n => {
                    let t = {}
                    t.ensembl = [n.query]
                    t.query = n.query 
                    return t
                }) 
            )

            excluded = myGeneResult.filter(gen => !gen?.ensembl?.every(el => el?.startsWith("ENS"))).map(gen => `${gen.query}` )
    
            let seedGenesInDatabase = []
    
            for await (let ens of included) {
                let ensemblIds = ens.ensembl.map(_n => nodeId(_n))
                let symbols = ens.query

                let gene = await neo4jsession
                    .run(`
                    MATCH (n:Gene) 
                    WHERE n.nodeidentifier IN $ensemblIds OR toUpper(n.symbol) = toUpper($symbols)
                    RETURN  n.nodeidentifier AS nodeidentifier,
                            n.biotype AS biotype, 
                            n.ensemblid AS ensemblid,
                            n.annotation AS annotation, 
                            n.chromosomename AS chromosomename, 
                            n.symbol AS symbol`, {
                        ensemblIds: ensemblIds, symbols: symbols
                    })

                gene = processNeo4jQueryResult(gene)
                if(gene.length > 0) {
                    gene.forEach(record => {
                        console.log(record)
                        seedGenesInDatabase.push(record)
                    })
                } else {

                    excluded.push(ens.query)
                }
            }

            included = included.map(gen => `${gen.query} : ${gen.ensembl}` )

            included = included.filter(x => 
                seedGenesInDatabase.map(y => y.ensemblid.toUpperCase()).includes(x.split(' : ')[1].toUpperCase()) ||
                seedGenesInDatabase.map(y => y.symbol.toUpperCase()).includes(x.split(' : ')[0].toUpperCase())
            )            

            res.json([seedGenesInDatabase, [...new Set(excluded)], included])

        } else {

            let excluded = []
            let included = []
    
            let seedGenesInDatabase = []
    
            for await (let ens of req.body.seedGenes) {
                let gene = await neo4jsession
                    .run(`
                    MATCH (n:Gene) 
                    WHERE toUpper(n.ensemblid) = toUpper(toString($ens)) OR toUpper(n.symbol) = toUpper(toString($ens)) OR n.entrez = toInteger($ens)
                    RETURN  n.nodeidentifier AS nodeidentifier,
                            n.biotype AS biotype, 
                            n.ensemblid AS ensemblid,
                            n.annotation AS annotation, 
                            n.chromosomename AS chromosomename, 
                            n.symbol AS symbol`, {
                        ens: ens
                    })

                gene = processNeo4jQueryResult(gene)
                if(gene.length > 0) {
                    gene.forEach(record => {
                        console.log(record)
                        seedGenesInDatabase.push(record)
                        included.push(`${ens} : ${record.ensemblid}`)
                    })
                    
                } else {
                    excluded.push(`${ens}`)
                }
            }

            res.json([seedGenesInDatabase, excluded, included])

        }

    }
    catch (error) {
        res.status(500).json({ reason: error })
        console.log(error)
    }
})





router.post('/api/find-friends-metadata-many-genes', async (req, res) => {
    try {
        const neo4jsession = neo4jGetSession(getDatabase(req.body.species, req.body.dataSource, req.body.tissue))

        let seedGenesInDatabaseArr = Array.from(req.body.seedGenesInDatabaseObj, (x) => x.nodeidentifier) || []
        let seedGenesInDatabaseCount = Object.values(seedGenesInDatabaseArr).length

        let allGenesCount = await neo4jsession.run(`MATCH (n:Gene) RETURN count(n)`)
        allGenesCount = allGenesCount.records[0]._fields[0].low

        let friendsObj = await neo4jsession
            .run(`
                MATCH (source:Gene) WHERE source.nodeidentifier IN $seedGenesInDatabaseArr
                MATCH (source)-[r:LIKE]->(target:Gene)
                RETURN  target.nodeidentifier as nodeidentifier,
                        target.ensemblid as ensemblid,
                        target.biotype AS biotype,
                        target.annotation AS annotation, 
                        target.chromosomename AS chromosomename, 
                        target.symbol AS symbol,
                        target.totalFriends as totalNumber,
                        size(collect(target.nodeidentifier)) AS geneSetNumber`, {
                seedGenesInDatabaseArr: seedGenesInDatabaseArr
            })
        friendsObj = processNeo4jQueryResult(friendsObj)

        let result = addPValue(friendsObj, allGenesCount, seedGenesInDatabaseCount, 0.05)

        res.json(result)

    }
    catch (error) {
        res.status(500).json({ reason: error })
        console.log(error)

    }
})




router.post('/api/find-friends-metadata-single-gene', async (req, res) => {
    try {
        const neo4jsession = neo4jGetSession(getDatabase(req.body.species, req.body.dataSource, req.body.tissue))

        const { seedGenesInDatabaseObj, threshold } = req.body

        let seedGenesInDatabaseArr = seedGenesInDatabaseObj?.map(gen => nodeId(gen.ensemblid)) ?? []

        let friendsObj = await neo4jsession
            .run(`
                MATCH (source:Gene) WHERE source.nodeidentifier IN $seedGenesInDatabaseArr
                MATCH (source)-[r:LIKE]-(target:Gene)
                WHERE r.correlation >= $threshold
                RETURN  target.nodeidentifier as nodeidentifier,
                        target.ensemblid as ensemblid,
                        target.biotype AS biotype,
                        target.annotation AS annotation, 
                        target.chromosomename AS chromosomename, 
                        target.symbol AS symbol,
                        r.correlation AS correlation`, {
                seedGenesInDatabaseArr: seedGenesInDatabaseArr,
                threshold: threshold
            })
        friendsObj = processNeo4jQueryResult(friendsObj)
        let result = filterAndSortingByCorrelation(friendsObj, 0.1)
        res.json(result)

    }
    catch (error) {
        res.status(500).json({ reason: error })
        console.log(error)

    }
})




router.post('/api/find-friends-david-data', async (req, res) => {

    let genesForDavidCount = req.body?.genesForDavidArr?.length

    if(genesForDavidCount === 0 || genesForDavidCount === undefined) { return res.json([]) }
    let genesForDavidIds = req.body.genesForDavidArr?.map(_id => ensemblid(_id, req.body.species, req.body.tissue))

    if (0.05 * genesForDavidCount > 1500) {
        genesForDavidIds = genesForDavidIds.slice(0, 1500)
    } else {
        genesForDavidIds = genesForDavidIds.slice(0, Math.max(Math.floor(0.05 * genesForDavidCount), 1))
    }

    try {
        let davidResult = await davidFetch(genesForDavidIds)
        res.json(davidResult.data)
    }
    catch (error) {
        res.sendStatus(504)
        console.log('DAVID server is down: ', error)

    }
})




router.post('/api/fetch-subgraph', async (req, res) => {
    try {
        const neo4jsession = neo4jGetSession(getDatabase(req.body.species, req.body.dataSource, req.body.tissue))

        let subGraph = await neo4jsession
            .run(`
                MATCH (n) WHERE n.nodeidentifier IN $subGraph
                MATCH (n)-[r:LIKE]->(m) 
                WHERE n.nodeidentifier < m.nodeidentifier
                AND m.nodeidentifier IN $subGraph
                AND r.correlation > $threshold
                RETURN  n.nodeidentifier AS id_source,
                        n.symbol AS symbol_source,
                        n.chromosomename as chromosome_source,
                        n.biotype as biotype_source,
                        m.nodeidentifier AS id_target,
                        m.symbol AS symbol_target,
                        m.chromosomename as chromosome_target,
                        m.biotype as biotype_target,
                        r.correlation AS correlation
                ORDER BY n.nodeidentifier`, {
                subGraph: req.body.subGraph,
                seedGenes: req.body.seedGenes,
                threshold: parseFloat(req.body.threshold)
            })
        subGraph = processNeo4jQueryResult(subGraph)

        res.json(subGraph)

    }
    catch (error) {
        res.status(500).json({ reason: error })
        console.log(error)

    }

})




module.exports = router