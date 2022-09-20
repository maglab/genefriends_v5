const { neo4jGetSession } = require('./configneo4j.js')

// /validate
const validate = async () => {
    //Variables
    const neo4jsession = neo4jGetSession('neo4j')
    let seedGenes = [2148, 2154] //Input usuario

    //Lógica
    try {
        const result = await neo4jsession
        .run(`CALL { MATCH (source:Gene) -[*1..1]-> (target:Gene) WHERE source.nodeidentifier IN $seedGenes RETURN source, target } RETURN target.nodeidentifier AS nodeidenfitier, count(*) AS geneSetNumber, target.ensemblid AS ensemblid`,
            {
                seedGenes: seedGenes
            })

    let processedResult = result.records.map(record => {

        let entries = new Map([
            [`${record.keys[0]}`, record._fields[0].low],
            [`${record.keys[1]}`, record._fields[1].low],
            [`${record.keys[2]}`, record._fields[2]]
        ])

        return Object.fromEntries(entries)

    })

    console.log(processedResult)

    } catch (error) {
        console.log(error)
    }
    

}
validate()