<template>
  <div class="gf-container">
    <Card class="p-py-6">
      <template #title>Saved Results</template>
      <template #subtitle
        >Here you can see all the analysis you have saved.</template
      >
      <template #content>
        <div class="container">
          <ul class="responsive-table">
            <li class="table-header">
              <div class="col col-1" style="font-weight: bold">Date</div>
              <div class="col col-2" style="font-weight: bold">Hour</div>
              <div class="col col-3" style="font-weight: bold">Name</div>
              <div class="col col-4"></div>
              <div class="col col-5"></div>
            </li>

            <li
              class="table-row"
              v-for="data in totalData"
              :key="data.timestamp"
            >
              <div
                class="col col-1"
                style="margin-left: 10px; margin-right: 10px"
                data-label="Timestamp"
              >
                {{
                  new Date(data.timestamp)
                    .toISOString()
                    .replace("T", " ")
                    .split(".")[0]
                    .substring(0, 10)
                }}
              </div>
              <div class="col col-sep;">
                <span>|</span>
              </div>
              <div
                class="col col-2"
                style="margin-left: 10px"
                data-label="Timestamp"
              >
                {{
                  new Date(data.timestamp)
                    .toISOString()
                    .replace("T", " ")
                    .split(".")[0]
                    .substring(10)
                }}
              </div>
              <div class="col col-sep">
                <span>|</span>
              </div>
              <div class="col col-3" data-label="File Name">
                {{ data.name }}
              </div>
              <div
                class="col col-4 parent"
                style="cursor: pointer; background: #aeaeae; margin-right: 12px"
                data-label="Open"
                @click="loadResult(data.timestamp)"
              >
                <div class="square-child" style="color: white">OPEN</div>
              </div>
              <div
                class="col col-5 parent"
                style="cursor: pointer; background: #3fc769; margin-right: 12px"
                data-label="Open"
                @click="downloadFriendsCSV(data.data)"
              >
                <div class="square-child">
                  <i
                    class="pi pi-download"
                    style="fontsize: 1.3rem; color: white"
                  >&nbsp;Friends</i>
                </div>
              </div>
              <div
                class="col col-5 parent"
                style="cursor: pointer; background: #3fc769; margin-right: 12px"
                data-label="Open"
                @click="downloadDavidCSV(data.data)"
              >
                <div class="square-child">
                  <i
                    class="pi pi-download"
                    style="fontsize: 1.3rem; color: white"
                  >&nbsp;David</i>
                </div>
              </div>
              <div
                class="col col-6 parent"
                style="
                  cursor: pointer;
                  background: #f45646;
                  border-radius: 0px 4px 4px 0px;
                "
                data-label="Delete"
                @click="deleteResult(data.timestamp)"
              >
                <div class="square-child">
                  <i
                    class="pi pi-trash"
                    style="fontsize: 1.3rem; color: white"
                  ></i>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, onMounted } from "vue";

export default {
  name: "Saved",
  setup() {
    const store = useStore();
    const router = useRouter();

    const totalData = computed(() => store.state.genesStore.allSavedData);

    onMounted(() => {
      store.dispatch("getAllData");
    });

    const loadResult = (ts) => {
      store.dispatch("loadResultById", ts);
      router.push({ name: "Results" });
    };

    const deleteResult = (ts) => {
      store.dispatch("deleteById", ts);
    };

    const downloadFriendsCSV = (data) => {
      let parsedData = JSON.parse(data)
      let csv = `"Ensembl ID","Gene Symbol","Pearson Correlation","Gene Biotype","Chromosome","Annotation"\n`
      parsedData.friendsMetadata.forEach(f => {
        csv += `"${f.ensemblid}","${f.symbol}","${f.correlation}","${f.biotype}","${f.chromosomename}","${f.annotation}"\n`
      })
      //console.log(csv)
      generateDownload("friends.csv", csv)
    }

    const downloadDavidCSV = (data) => {
      
      let parsedData = JSON.parse(data)
      console.log(parsedData)
      let csv = `"Cluster","Annotation Cluster","Term Definition","Enrichment Score","Count","P Value","List Total","Pop Hits","Pop Total","Fold Enrichmemnt","Bonferroni","Benjamini","FDR"\n`
      parsedData.david.data.forEach(f => {
        csv += `"${f.cluster}","${f.annotation_cluster}","${f.term_definition}","${f.enrichment_score}","${f.pvalue}","${f.list_total}","${f.pop_hits}","${f.pop_total}","${f.fold_enrichment}","${f.bonferroni}","${f.benjamini}","${f.FDR}"\n`
      })
      //console.log(csv)
      generateDownload("david.csv", csv)
    }


    const generateDownload = (filename, content) => {
      const a = document.createElement("a")
      a.href = `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`
      a.download = filename;
      a.click()
    }

    return {
      totalData,
      deleteResult,
      loadResult,
      downloadFriendsCSV,
      downloadDavidCSV
    };
  },
};
</script>

<style scoped>
h2,
section {
  color: var(--main-color);
}

.open-container {
  background-color: gainsboro;
}

.container {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 10px;
  padding-right: 10px;
  color: var(--main-color);
}

h2 {
  font-size: 26px;
  margin: 20px 0;
  text-align: center;
}

li {
  border-radius: 3px;

  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.table-header {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.table-row {
  background-color: #ffffff;
  border: 1px solid var(--main-color);
  border-radius: 5px;
}

.col-1 {
  flex-basis: 9%;
}
.col-sep {
  flex-basis: 2%;
}
.col-2 {
  flex-basis: 9%;
}
.col-sep {
  flex-basis: 2%;
}
.col-3 {
  flex-basis: 48%;
}
.col-4 {
  flex-basis: 10%;
}
.col-5 {
  flex-basis: 10%;
}
.col-6 {
  flex-basis: 10%;
}
.parent {
  width: 100%;
  height: 50px;
}
.square-child {
  width: 50%;
  margin: 0 auto;
  height: 100%;

  display: flex;
  justify-content: center !important;
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}
</style>