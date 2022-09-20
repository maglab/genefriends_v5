<template>
    <div class="p-d-flex p-flex-column">
        <div class="p-mb-2">
            <Card>
                <template #content>
                    <div class="p-grid">
                        <div class="p-col-12 p-sm-4">
                            <h3>Top Co-expressed:</h3>
                            <InputText v-model.number="topCoExpressed" style="width: 100%;" />
                            <Slider v-model="topCoExpressed"
                                    :min="1"
                                    :max="50" />
                        </div>
                        <div class="p-col-12 p-sm-4">
                            <h3>Pearson Correlation Threshold:</h3>
                            <InputText v-model.number="threshold" style="width: 100%;" />
                            <Slider v-model="threshold"
                                    :step="0.01"
                                    :min="0.0"
                                    :max="1.0" />
                        </div>
                        <div class="p-col-12 p-sm-4">
                            <h3 class="p-text-bold">Show correlation:</h3>
                            <SelectButton v-model="correlationToggle"
                                          :options="toggleOptions" />
                        </div>
                    </div>
                </template>
            </Card>
        </div>
        <div>
            <Card>
                <template #content>
                    
                    <div class="super-container">
                        
                        <div>
                            <div id="legend-container" v-for="(el, index) in legendElement" :key="index">
                                <svg height="100">
                                    <text x="20" y="35" class="small">{{capitalizeFirstLetter(index.replace('_', ' '))}}</text>
                                    <circle cx="40" cy="76" r="20"
                                        :style="{fill:el}" />
                                </svg>
                            </div>
                            <br>
                            <span style="font-size:0.8em;">"Star Nodes" &#9733; denote seed genes.</span>
                        </div>

                        <div id="container" style="height: calc(100vh - 350px);"></div>

                    </div>
                </template>
            </Card>
        </div>
    </div>
    <Dialog header="Gene Information"
            v-model:visible="displayGeneInformation"
            :style="{width: '25vw'}"
            position="left"
            :modal="true"
            :dismissableMask="true">
        <GeneCard :geneData="geneData" />
    </Dialog>

</template>

<script>
import {
    onMounted,
    ref,
    watch,
    computed
} from 'vue'
import { useStore } from 'vuex'
import Anychart from 'anychart'
import axios from 'axios'
import GeneCard from './GeneCard'
import {
    buildNetworkStructure
} from '../../supportFunctions.js'
const {
    PORT
} = require('../../endpoint.js')
const _ = require('lodash')

export default {
    name: 'Graph',
    components: {GeneCard},
    setup() {
        const store = useStore();

        const friendsMetadata = computed(() => store.state.genesStore.friendsMetadata);
        const inputData = ref(store.state.genesStore.input)
        const setupData = ref(store.state.genesStore.setup)
        const seedGenesInDatabaseObj = ref(setupData.value.seedGenesInDatabaseObj);
        const species = ref(inputData.value.species);
        const dataSource = ref(inputData.value.dataSource);
        const tissue = ref(inputData.value.tissue);
        const legendElement = ref([]);


        const displayGeneInformation = ref(false)

        const correlationToggle = ref('Off')
        const toggleOptions = ref(['Off', 'On'])

        const data = ref()
        const topCoExpressed = ref(20)
		const threshold = ref(0.85)
		const selectedSeedGenes = ref([])
        const geneData = ref({})
        const biotypeDict = ref({
            antisense:"#c0392b",
            IG_C_gene:"#e74c3c",
            IG_J_gene:"#9b59b6",
            IG_LV_gene:"#2980b9",
            IG_V_gene: "#502c3e",
            IG_V_pseudogene:"#1abc9c",
            lincRNA:"#27ae60",
            lncRNA: "#2ecc71",
            miRNA:"#f1c40f",
            misc_RNA:"#f39c12",
            Mt_rRNA:"#e67e22",
            Mt_tRNA:"#d35400",
            novel:"#34495e",
            polymorphic_pseudogene:"#2c3e50",
            processed_pseudogene: "#CCCCFF",
            processed_transcript: "#2c2c50",
            protein_coding: "#3498db",
            pseudogene: "#502c2c",
            ribozyme: "#502c50",
            rRNA: "#3d502c",
            scaRNA: "#2c502d",
            sense_intronic: "#2c503f",
            sense_overlapping: "#502c36",
            snoRNA: "#50342c",
            snRNA: "#50462c",
            TEC: "#48502c",
            TR_C_gene: "#6ca627",
            TR_D_gene: "#a6a127",
            TR_J_gene: "#a127a6",
            TR_J_pseudogene: "#5215a8",
            TR_V_gene: "#a8156b",
            TR_V_pseudogene: "#a81522",
            transcribed_processed_pseudogene: "#a85215",
            transcribed_unitary_pseudogene: "#a89b15",
            transcribed_unprocessed_pseudogene: "#2547a1",
            unitary_pseudogene: "#4125a1",
            unprocessed_pseudogene: "#0a5fa4"
        })

        const capitalizeFirstLetter = (_string) => {
        return _string.charAt(0).toUpperCase() + _string.slice(1);
        }


		const fetchLinksFromDatabase = async (_subGraph, _threshold, _species, _dataSource, _tissue, _subGraphSeedGenes) => {

            let result = await axios.post(PORT + '/fetch-subgraph', {
                subGraph: _subGraph,
                seedGenes: _subGraphSeedGenes,
				threshold: parseFloat(_threshold),
				species: _species,
				dataSource: _dataSource,
				tissue: _tissue
			})
                return result
		}

        const clean = async () => {
            const temp1 = document.querySelector('#container')
            temp1.innerHTML = ''
            const temp2 = document.querySelector('#legend-container')
            temp2.innerHTML = ''
        }


        const setupNodes = async (_nodes) => {

            _nodes.labels().format("{%name}")

            _nodes.labels().enabled(true)
            _nodes.labels().fontSize(12)

            _nodes.tooltip().useHtml(true);
            _nodes.tooltip().format("{%name}, Chromosome {%chromosome}, {%biotype}")

            // set the size of nodes
            _nodes.normal().height(30)
            _nodes.hovered().height(45)
            _nodes.selected().height(45)

            return _nodes
        }


        const setupEdges = async (_edges) => {

            _edges.tooltip().useHtml(true)
            _edges.tooltip().format("{%value}")

            _edges.labels().enabled(correlationToggle.value=='On')

            _edges.labels().format("{%value}")

            return _edges
        }


		const addPlot = async (_subGraphFriends, _subGraphSeedGenes, _threshold, _species, _dataSource, _tissue) => {

            let subGraph = _.union(_subGraphFriends, _subGraphSeedGenes)
            
            let fetchedLinks = await fetchLinksFromDatabase(subGraph, _threshold, _species, _dataSource, _tissue, _subGraphSeedGenes)

            data.value = await buildNetworkStructure(fetchedLinks.data, _subGraphSeedGenes, 'biotype')
            let legendValues = data.value.nodes.map(_n=>_n.biotype)
            legendValues = [...new Set(legendValues)]

            addLegend(legendValues)

            let chart = Anychart.graph(data.value)

            let nodes = chart.nodes()
            nodes = await setupNodes(nodes)

            let edges = chart.edges()
            edges = await setupEdges(edges)

            await clean()

            chart.container("container").draw()

		}

        const addLegend = async (_legendValues) => {

            legendElement.value = _.mapKeys(biotypeDict.value, function(value, key) {
                if(_legendValues.includes(key)) {
                    return key
                }
            })
            
            legendElement.value.pop()

        }

		const autoClick = () => {
			let subGraphFriends = friendsMetadata.value.slice(0, topCoExpressed.value).map(_n => _n.nodeidentifier)
            let subGraphSeedGenes = seedGenesInDatabaseObj.value.map(_n => parseInt(_n.nodeidentifier))
			addPlot(subGraphFriends, subGraphSeedGenes, threshold.value, species.value, dataSource.value, tissue.value)
		}

        onMounted(() => {
            autoClick()
        })

        watch(correlationToggle, ()=>{
            autoClick()
        })

        watch(topCoExpressed, ()=>{
            autoClick()
        })

        watch(threshold, ()=>{
            autoClick()
        })

        return {
            friendsMetadata,
            autoClick,
            topCoExpressed,
            correlationToggle,
            threshold,
            capitalizeFirstLetter,
            toggleOptions,
            legendElement,
            geneData,
			selectedSeedGenes,
            displayGeneInformation
        }
    }
}
</script>
<style scoped>

.super-container {
    display: grid;
    grid-template-columns: 20% auto;
    grid-template-rows: auto;

}

#container {
        width: 100%;
        height: 50em;
        margin: 0;
        padding: 0;
}

h3{
    color: var(--main-color);
}

.note{
    color: var(--main-color);
}

p {
    line-height: 1.5;
    margin: 0;
    color: var(--main-color)
}

.p-dropdown {
    width: 18rem;
}

.buttonsContainer{
    display:flex;
    justify-content: space-between;
}

.buttonsLeft{
    display:flex;
    justify-content:space-between;
    flex-wrap: wrap;
    width: 100%;
}

.buttonsRight{
    margin: 5px 15px;
    display:flex;
    justify-content: center;
    align-items: flex-start;
    margin: 8px;
}

.selectorContainer{
    margin: 8px 8px 8px 0;
}

span{
    margin-right: 15px;
}

::v-deep(.p-card-body) {
    padding: 0rem;
}

</style>