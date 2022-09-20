import logging
import sys
import flask
from flask import request, jsonify
from flask import json
from suds import *
from suds.client import Client


email = 'rguinea@pucp.edu.pe'

def D(value):
    return round(value,2)

def DSc(value):
    return '%.2E' % value

def setup_logging():
    if sys.version_info < (2, 5):
        fmt = '%(asctime)s [%(levelname)s] @%(filename)s:%(lineno)d\n%(message)s\n'
    else:
        fmt = '%(asctime)s [%(levelname)s] %(funcName)s() @%(filename)s:%(lineno)d\n%(message)s\n'
    logging.basicConfig(level=logging.INFO, format=fmt)

def david_setup(client, input_ids, id_type='ENSEMBL_GENE_ID', bg_ids=[], bg_name='IPython_bg_name', list_name='IPython_example_list', category=''):
    david = client.service
    input_ids = ','.join(input_ids)
    if bg_ids:
        bg_ids = ','.join(bg_ids)
    list_type = 0
    david.addList(input_ids, id_type, list_name, list_type)
    if bg_ids:
        list_type = 1
        david.addList(bg_ids, id_type, bg_name, list_type)
    david.setCategories(category)
    return david

def davidClient(input_ids, id_type='ENSEMBL_GENE_ID', bg_ids=[]):
    setup_logging()
    logging.getLogger('suds.client').setLevel(logging.DEBUG)
    url = 'https://david.ncifcrf.gov/webservice/services/DAVIDWebService?wsdl'
    client = Client(url)
    client.wsdl.services[0].setlocation('https://david.ncifcrf.gov/webservice/services/DAVIDWebService.DAVIDWebServiceHttpSoap12Endpoint/')
    client.service.authenticate('dam016@liverpool.ac.uk')
    listName = 'make_up'
    david = david_setup(
                client=client,
                input_ids=input_ids, 
                id_type=id_type, 
                bg_ids=bg_ids, bg_name='IPython_bg_name',
                list_name=listName, category="COG_ONTOLOGY,INTERPRO,KEGG_PATHWAY,OMIM_DISEASE,PIR_SUPERFAMILY,SP_PIR_KEYWORDS,UP_SEQ_FEATURE,GOTERM_BP_FAT,GOTERM_CC_FAT,GOTERM_MF_FAT")
    overlap = 3
    initialSeed = 2
    finalSeed = 2
    linkage = 0.5
    kappa = 20
    termClusteringReport = david.getTermClusterReport(overlap, initialSeed, finalSeed, linkage, kappa)
    result = ''
    i = 0
    for simpleTermClusterRecord in termClusteringReport:
        i = i+1
        EnrichmentScore = simpleTermClusterRecord.score
        for simpleChartRecord in  simpleTermClusterRecord.simpleChartRecords:
            if simpleChartRecord.benjamini < 0.05 and simpleChartRecord.bonferroni < 0.05:
                cluster        = 'cluster\":' + '\"Cluster ' + str(i) + '\"'
                categoryName   = '\"annotation_cluster\":' + '\"' + simpleChartRecord.categoryName + '\"'
                termName       = '\"term_definition\":' + '\"' + simpleChartRecord.termName + '\"'
                score          = '\"enrichment_score\":' + str(D(EnrichmentScore))
                listHits       = '\"count\":' + str(simpleChartRecord.listHits)
                ease           = '\"pvalue\":' + '\"' + str((DSc(simpleChartRecord.ease))) + '\"'
                listTotals     = '\"list_total\":' + str(simpleChartRecord.listTotals)
                popHits        = '\"pop_hits\":' + str(simpleChartRecord.popHits)
                popTotals      = '\"pop_total\":' + str(simpleChartRecord.popTotals)
                foldEnrichment = '\"fold_enrichment\":' + str(D(simpleChartRecord.foldEnrichment))
                bonferroni     = '\"bonferroni\":' + '\"' + str(DSc(simpleChartRecord.bonferroni)) + '\"'
                benjamini      = '\"benjamini\":' + '\"' + str(DSc(simpleChartRecord.benjamini)) + '\"'
                FDR            = '\"FDR\":' + '\"' + str(DSc(simpleChartRecord.afdr)) + '\"'
                rowList        = [cluster,categoryName,termName,score,str(listHits),str(ease),str(listTotals),str(popHits),str(popTotals),str(foldEnrichment),str(bonferroni),str(benjamini),str(FDR)]
                result         += '{\"'+','.join(rowList)+'},'
    result = result[:-1]
    return str(result)

app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/', methods=['POST'])
def home():
    request_data = request.get_json()
    foregenes = request_data['foregenes']
    print(foregenes)
    tsv = davidClient(foregenes)
    return jsonify(tsv)

app.run(host='0.0.0.0', port=9000)