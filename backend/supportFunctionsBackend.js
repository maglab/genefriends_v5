const _ = require('lodash')
const cdf = require('binomial-cdf')
const { PythonShell } = require('python-shell')
const { default: axios } = require("axios")
const {spawn} = require('child_process');
const path = require('node:path');
const data = require('./records_3.json')

const isNull = (value) => typeof value === "object" && !value

// Given that and Ensembl ID has the following structure ENS(species)(object type)(identifier), 
//     this function takes is and returns an integer based on the identifier (without considering leading zeros) and the object's type (by using a bijection
//     between letters (G, T, R, etc.) and integers). See https://www.ensembl.org/info/genome/stable_ids/prefixes.html
const nodeId = (ensemblid) => {
    if (ensemblid.includes("ENS") || ensemblid.includes("WBGene") || ensemblid.includes("FBgn")) {
        let cod = ensemblid.replace(/^\D+/g, '').replace(/^0+/, '')
        return parseInt(cod)
    } else {
        return data.find(d => d.ensemblid === ensemblid)?.nodeidentifier || -1
    }

}




// This function takes two nodeId()'s and, disregarding order, returns a unique identifier (integer) by using the following bijection:
// https://cs.stackexchange.com/questions/57262/compressing-two-integers-disregarding-order
// Which, to be fair, it is witchcraft
const edgeId = (n0, n1) => {
    let edgeidentifier = 0
    if (n0 < n1) {
        edgeidentifier = (n1) * (n1 - 1) / 2 + n0
    } else {
        edgeidentifier = (n0) * (n0 - 1) / 2 + n1
    }
    return edgeidentifier
}




const ensemblid = (_nodeidentifier, _species, _tissue) => {
    if (_species != "SCER") {
        _tissue = _tissue.replace(/\d+/g, '') // Extract just the object type (i.e., G or T)
        _nodeidentifier = _nodeidentifier.toString().padStart(11, "0") // Get the numeric part of an ENSEMBL ID based on the nodeidentifier
        return _species + _tissue + _nodeidentifier // Rebuild the ENSEMBL ID
    } else {
        return data.find(d => d.nodeidentifier === _nodeidentifier).ensemblid;
    }
}




const seekPath = (_model, _species, _tissue) => {
    return '../models/' + _model + '_' + _species + '_' + _tissue
}




const formater = () => {
    const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`

    const memoryData = process.memoryUsage()

    const memoryUsage = {
        rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
        heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
        heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
        external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
    }

    console.log(memoryUsage)
}




const processNeo4jQueryResult = (_rawResult) => _rawResult.records.map(r => {
    let entries = new Map()
    for (let i = 0; i < r.keys.length; i++) {
        entries.set(r.keys[i], (r._fields[i]?.low || r._fields[i]))
    }
    return Object.fromEntries(entries)
})




const getDatabase = (_species, _dataSource, _tissue) => {
    return _species + _dataSource + _tissue
}




const getSpeciesForMyGene = (_species) => {
    if (_species === 'ENS') {
        return 'human'
    } else if (_species === 'ENSMUS') {
        return 'mouse'
    } else if (_species === 'ENSDAR') {
        return 'zebrafish'
    } else if (_species === 'ENSRNO') {
        return 'rat'
    } else if (_species === 'DMEL') {
        return 'fruitfly'
    } else if (_species === 'CELE') {
        return 'nematode'
    } else {
        return 'all'
    }
}


const strip = (_number, _precision) => {
    return parseFloat((parseFloat(_number).toPrecision(_precision)))
}

const addPValue = (_friendsObj, _allGenesCount, _seedGenesInDatabaseCount, _alpha) => {
    return _.orderBy(
      _friendsObj.map(_n => ({
        ..._n,  // for each _n:
        pvalue: 1 - strip( cdf(_n.geneSetNumber, _seedGenesInDatabaseCount, _n.totalNumber / _allGenesCount), 15 )  // calculate pvalue and add it to gene _n
      })).filter(_n => _n.pvalue < _alpha), // filter out non-significant genes
      ['pvalue'], ['asc'])  //_.orderBy pvalue in an ascending order  
}




const filterAndSortingByCorrelation = (_friendsObj, _threshold) => {
    return _.orderBy(
      _friendsObj.filter(_n => _n.correlation > _threshold), // filter out non-significant genes
      ['correlation'], ['desc']) //_.orderBy correlation in an ascending order  
}

const davidFetch = async (_genesForDavidIds) => await axios.post('http://66.97.43.104:9000', { foregenes : _genesForDavidIds })

const geneIdConverter = (nonEnsemblGeneList, species, objectType) => {
    return new Promise((resolve, reject) => {
        let result;
        const python = spawn('python', [path.join(__dirname + "/routes/geneIdConverter.py"), nonEnsemblGeneList, species, objectType]);
        python.stdout.on('data', function (data) {
            console.log('Pipe data from python script ...');
            result = data.toString();
        });
        // in close event we are sure that stream from child process is closed
        python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            // send data to browser
            console.log(result)
            resolve(JSON.parse(result))
        });
    })
}




module.exports = {
    ensemblid,
    edgeId,
    formater,
    isNull,
    nodeId,
    seekPath,
    processNeo4jQueryResult,
    getDatabase,
    getSpeciesForMyGene,
    addPValue,
    filterAndSortingByCorrelation,
    davidFetch,
    geneIdConverter
}