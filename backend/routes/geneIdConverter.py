import json
import mygene
import sys

mg = mygene.MyGeneInfo()

result = mg.querymany(sys.argv[1], scopes='symbol, entrezgene, ensembl.gene, ensembl.transcript', fields=sys.argv[3], species=sys.argv[2], verbose=False)

print (json.dumps(result))