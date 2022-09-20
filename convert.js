let input = [{
    '_id': '1586',
    '_score': 25.448362,
    'ensembl': { 'gene': 'ENSG00000148795' },
    'query': 'ENSG00000148795'
},
{
    '_id': '203522',
    '_score': 92.10076,
    'ensembl': { 'gene': 'ENSG00000165359' },
    'query': 'INTS6L'
},
{
    '_id': '4102',
    '_score': 122.48908,
    'ensembl': { 'gene': 'ENSG00000221867' },
    'query': 'MAGEA3'
},
{
    '_id': '3265',
    '_score': 90.13757,
    'ensembl': [{ 'gene': 'ENSG00000276536' }, { 'gene': 'ENSG00000174775' }],
    'query': 'HRAS'
},
{ 'notfound': true, 'query': 'fadsfasdfa' }]

let result = {
    excluded: [],
    included: []
};

//Formatting the input
for (const gen of input) {
    result.push({
        ensembl : Array.isArray(gen.ensembl) ? gen.ensembl.map(el => el?.gene) : [gen.ensembl?.gene],
        query : gen.query
    })
}

//Excluding the notfound genes

/*
genefriends solo procesa identificadores ENS-*
included es para que la db verifique si los tengo
excluded, no es para que la db verifique si los tengo (no tienen ensemblid)
*/

console.log(result)