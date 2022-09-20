<template>
  <div v-if="friendsMetadataLoading" class="spinner-container text-center">
    <ProgressSpinner class="p-my-4" />
  </div>
  <div v-else class="content">
    <div class="navContainer">
      <nav class="subnav">
        <router-link to="/start/results/genestable">Friends</router-link>
        <router-link to="/start/results/davidtable">DAVID: Friends</router-link>
        <router-link to="/start/results/analytics">Analytics</router-link>
        <router-link to="/start/results/graph"
          >Network Visualization</router-link
        >
      </nav>
      <Button
        label="Save Results"
        @click="saveResultsModal()"
        class="gf-button-save saveResultsBtn"
      />
    </div>
    <router-view />
    <div class="p-grid p-nogutter p-justify-between">
      <Button label="Back" @click="prevPage()" class="gf-button-primary" style="font-size: 1.4em; margin-bottom: 5px" />
    </div>
  </div>

  <Dialog
    header="Save your results"
    v-model:visible="displaySaveData"
    :modal="true"
    :style="{
      width: '30vw',
      marginTop: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'white',
      flexDirection: 'column',
    }"
    position="top"
    :dismissableMask="true"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
  >
    <InputText type="text" v-model="savedDataName" />
    <div style="display: flex; justify-content: center; margin: 10px">
      <Button
        label="Save"
        @click="saveResults()"
        style="background: #3fc769; color: white"
      />
    </div>
  </Dialog>
</template>

<script>
import GenesTable from "../auxiliary_components/GenesTable";
import DavidTable from "../auxiliary_components/DavidTable";
import Analytics from "../auxiliary_components/Analytics";
import Graph from "../auxiliary_components/Graph";
import { useStore } from "vuex";
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "Results",
  components: {
    GenesTable,
    DavidTable,
    Analytics,
    Graph,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    if(route.query?.id){
      store.dispatch("loadResultById", { id: route.query.id })
    }

    router.push("/start/results/genestable")

    const friendsMetadataLoading = computed(
      () => store.state.genesStore.friendsMetadataLoading
    );

    const prevPage = () => {
      router.push("/start/setup")
    }

    const displaySaveData = ref(false);
    const savedDataName = ref("");

    const saveResultsModal = () => {
      displaySaveData.value = true;
    };

    const saveResults = () => {
      store.dispatch("saveDataToIDB", {
        name: savedDataName.value
      });
      displaySaveData.value = false;
    };

    return {
      friendsMetadataLoading,
      prevPage,
      saveResults,
      saveResultsModal,
      displaySaveData,
      savedDataName,
    };
  },
};
</script>

<style scoped>
.navContainer{
  display:flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-bottom: 15px;
}
.subnav {
  display: flex;
  flex-wrap: wrap;
}
.subnav > a {
  padding: 10px 22px;
  font-weight: bold;
  text-decoration: none;
  background: white;
  color: var(--main-color);
  font-size: 1.3em;
  border: 1px solid #ffad0e;
}
a.router-link-active,
a.router-link-exact-active {
  background: #ffad0e;
  color: white;
}
.box {
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  text-align: right;
}
.flex-h {
  display: flex;
  align-content: content;
}
.w {
  flex-wrap: wrap;
  justify-content: space-between;
}
.buttonsState > button:first-child {
  margin-right: 15px;
}
@media (max-width: 975px) {
  .loadState,
  .buttonsState {
    width: 100%;
  }
  .buttonsState {
    justify-content: space-between;
  }
  .saveResultsBtn{
    width: 100%;
    margin-top: 15px
  }
}

.spinner-container {
  position: relative;
  width: 100% !important;
  height: 35em !important;
}
</style>