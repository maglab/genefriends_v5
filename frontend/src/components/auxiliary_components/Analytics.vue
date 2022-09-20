<template>
  <Card>
    <template #content>
      <div class="p-grid text-chart">
        <div class="p-col-12 p-sm-4">
          <h3>Top Co-expressed:</h3>
          <InputText v-model.number="topCoExpressed" style="width: 100%" />
          <Slider
            v-model="topCoExpressed"
            :min="1"
            :max="friendsMetadata.length"
            @slideend="refreshCharts()" 
          />
        </div>
      </div>
    </template>
  </Card>
  <div id="charts">
    <div class="chart" v-if="!friendsEmpty">
      <h3>Biotype Distribution</h3>
      <p>
        This chart shows the biotype's distribution of the top
        {{ topCoExpressed }} Friends.
      </p>
      <div id="biotypeContainer" class="container" ref="biotypeContainer"></div>
    </div>
    <div class="chart">
      <h3>Chromosome Distribution</h3>
      <p>
        This chart shows the chromosome's distribution of the top
        {{ topCoExpressed }} Friends.
      </p>
      <div
        id="chromosomeContainer"
        class="container"
        ref="chromosomeContainer"
      ></div>
    </div>
    <div class="chart">
      <h3>Friend's Annotations WordCloud</h3>
      <p>
        The relative size of the words represent the number it occurs across the
        annotations of the top
        {{ topCoExpressed }} Friends.
      </p>
      <p>
        This chart give insight on the functions associated to the Seed Genes
        inputted by the user.
      </p>
      <div
        id="friendsWordCloudContainer"
        class="container"
        ref="friendsWordCloudContainer"
      ></div>
    </div>
    <div class="chart">
      <h3>DAVID's Term Definition WordCloud</h3>
      <p>
        This chart give insight on the functions associated to the Seed Genes
        inputted by the user acording to
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://david.ncifcrf.gov/"
          >David Functional Annotations</a
        >.
      </p>
      <ProgressSpinner v-if="davidLoading" class="p-my-4 david" />
      <div
        id="davidAnnotationsContainer"
        class="container"
        ref="davidAnnotationsContainer"
      ></div>
      <p>
        The relative size of the words represent the number it occurs across the
        term definitions of the selected cluster.
      </p>
      <br />
      <div v-if="davidLoading && davidEmpty">
        <Dropdown placeholder="Loading..." loading class="p-mb-4"></Dropdown>
      </div>
      <div v-else-if="!davidLoading && davidEmpty">
        <p>Sorry, no data.</p>
      </div>
      <div v-else>
        <Dropdown
          v-model="selectedCluster"
          :options="clusters"
          optionLabel="name"
          optionValue="code"
          placeholder="Select a cluster"
          class="p-mb-4"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  ref,
  watchEffect,
  onMounted,
  watch,
  computed,
} from "@vue/runtime-core";
import { parse, View } from "../../../node_modules/vega";
import {
  wordcloudSpecifications,
  pieChartSpecifications,
  findOcc,
} from "../../supportFunctions.js";
import { useStore } from "vuex";
const _ = require("lodash");

export default {
  name: "Analytics",
  components: {},
  setup() {
    const store = useStore();
    const friendsMetadata = computed(
      () => store.state.genesStore.friendsMetadata
    );
    const davidEmpty = computed(() => store.getters.davidDataEmpty);
    const davidLoading = computed(
      () => store.state.genesStore.david.loading
    );
    const friendsEmpty = computed(() => store.getters.friendsMetadataEmpty);
    const friendsDavidData = computed(() => store.state.genesStore.david.data);
    const biotypeContainer = ref();
    const chromosomeContainer = ref();
    const friendsWordCloudContainer = ref();
    const davidAnnotationsContainer = ref();
    const topCoExpressed = ref(150);
    const selectedCluster = ref("");
    const clusters = ref([]);

    const flag = ref(true);

    const drawWordcloud = async (_annotations, _container) => {
      const spec = wordcloudSpecifications(_annotations);

      const runtime = parse(spec);
      let view = new View(runtime)
        .renderer("svg")
        .initialize(_container)
        .hover();

      view.runAsync();
    };

    const drawPieChart = (_attribute, _frequencies, _title, _container) => {
      const spec = pieChartSpecifications(_attribute, _frequencies, _title);

      const runtime = parse(spec);
      let view = new View(runtime)
        .renderer("svg")
        .initialize(_container)
        .hover();

      view.runAsync();
    };

    const autoClick = async () => {
      let davidAnnotations = friendsDavidData.value
        .filter((_o) => _o.cluster === selectedCluster.value)
        .map((_o) => _o.term_definition)
        .join(" ")
        .replace(/[0-9]/g, "");
      await drawWordcloud(davidAnnotations, davidAnnotationsContainer.value);

      flag.value = false;
    };

    onMounted(() => {
      if (!friendsEmpty.value) {
        let selectedGenes = friendsMetadata.value.slice(
          0,
          topCoExpressed.value
        );

        let biotypeFrequencies = JSON.stringify(
          findOcc(selectedGenes, "biotype")
        );
        let chromosomenameFrequencies = JSON.stringify(
          findOcc(selectedGenes, "chromosomename")
        );

        drawPieChart(
          "biotype",
          biotypeFrequencies,
          "Biotype",
          biotypeContainer.value
        );
        drawPieChart(
          "chromosomename",
          chromosomenameFrequencies,
          "Chromosome",
          chromosomeContainer.value
        );

        let friendsAnnotations = selectedGenes
          .map((_n) => _n.annotation)
          .join(" ")
          .replace(/[0-9]/g, "");

        drawWordcloud(friendsAnnotations, friendsWordCloudContainer.value);
      }
    });

    watchEffect(() => {
      if (!davidEmpty.value && clusters.value.length == 0) {
        clusters.value = friendsDavidData.value.map((_o) => {
          return {
            name: _o.cluster,
            code: _o.cluster,
          };
        });

        clusters.value = _.unionBy(clusters.value, "code");

        let davidAnnotations = friendsDavidData.value
          .filter((_o) => _o.cluster === clusters.value[0].code)
          .map((_o) => _o.term_definition)
          .join(" ")
          .replace(/[0-9]/g, "");

        drawWordcloud(davidAnnotations, davidAnnotationsContainer.value);
        selectedCluster.value = clusters.value[0].code;
      }

      if (!davidEmpty.value && clusters.value.length != 0) {
        autoClick();
      }
    });

    watch(topCoExpressed, () => {
      autoClick();
    });

    const refreshCharts = () => {
      if (!friendsEmpty.value) {
        let selectedGenes = friendsMetadata.value.slice(
          0,
          topCoExpressed.value
        );

        let biotypeFrequencies = JSON.stringify(
          findOcc(selectedGenes, "biotype")
        );
        let chromosomenameFrequencies = JSON.stringify(
          findOcc(selectedGenes, "chromosomename")
        );

        drawPieChart(
          "biotype",
          biotypeFrequencies,
          "Biotype",
          biotypeContainer.value
        );
        drawPieChart(
          "chromosomename",
          chromosomenameFrequencies,
          "Chromosome",
          chromosomeContainer.value
        );

        let friendsAnnotations = selectedGenes
          .map((_n) => _n.annotation)
          .join(" ")
          .replace(/[0-9]/g, "");

        drawWordcloud(friendsAnnotations, friendsWordCloudContainer.value);
      }
    }

    return {
      friendsDavidData,
      friendsMetadata,
      davidLoading,
      davidEmpty,
      friendsEmpty,
      biotypeContainer,
      chromosomeContainer,
      topCoExpressed,
      friendsWordCloudContainer,
      davidAnnotationsContainer,
      selectedCluster,
      clusters,
      flag,
      refreshCharts
    };
  },
};
</script>

<style scoped>

svg *{
  fill: var(--main-color) !important;
}

h3{
  color: var(--main-color)
}
.center {
  margin: auto;
  width: 60%;
  padding: 10px;
}

.container {
  overflow: hidden !important;
  vertical-align: middle !important;
  width: 100% !important;
  padding: 1em;
}

p {
  line-height: 1.5;
  margin: 0;
    color: var(--main-color)
}

.p-dropdown {
  width: 18rem;
}
.buttonsContainer {
  display: flex;
  justify-content: space-between;
}

.buttonsLeft {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
}

.buttonsRight {
  margin: 5px 15px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 8px;
}

.selectorContainer {
  margin: 8px 8px 8px 0;
}
span {
  margin-right: 15px;
}
.p-grid {
  flex-direction: column;
}
::v-deep(.p-card-body) {
  padding: 0rem;
}
#charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 550px));
  justify-content: center;
  gap: 10px;
}
.chart {
  margin: 0;
  border: 1px solid lightblue;
  padding: 5px 25px;
}
@media (max-width: 1200px) {
  #charts {
    grid-template-columns: 100%;
  }
}
</style>