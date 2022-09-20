<template>
  <div v-if="davidLoading" class="spinner-container text-center">
    <ProgressSpinner class="p-my-4" />
  </div>
  <div v-else>
    <div v-if="davidEmpty">
      <p>David friends not found</p>
    </div>
    <div v-else>
      <DataTable
        ref="tabledavid"
        :value="tableData"
        :paginator="true"
        :rows="10"
        sortField="cluster"
        :sortOrder="1"
        class="p-datatable-sm"
        columnResizeMode="expand"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 20, 40, 80]"
        responsiveLayout="scroll"
        rowGroupMode="subheader"
        groupRowsBy="cluster"
        exportFilename="david-functional-annotations"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      >
        <template #header>
          
      <div class="p-jc-between p-d-none p-d-md-flex" style="margin: 10px 0 0 0">
        <div class="p-d-flex p-flex-column p-flex-md-row">
          <div class="p-mb-2 p-mr-2">
            <Button
              class="p-button-help"
              icon="pi pi-external-link"
              label="Download CSV"
              type="button"
              @click="exportDavid()"
            />
          </div>
        </div>
      </div>
        </template>
        <Column
          field="cluster"
          header="Cluster"
          style="min-width: 150px"
        ></Column>
        <Column
          field="annotation_cluster"
          header="Annotation Cluster"
          style="min-width: 180px"
        ></Column>
        <Column
          field="term_definition"
          header="Term Definition"
          style="min-width: 180px"
        ></Column>
        <Column
          field="enrichment_score"
          header="Enrichment Score"
          style="min-width: 70px"
        ></Column>
        <Column field="count" header="Count" style="min-width: 70px">
        </Column>
        <Column
          field="pvalue"
          header="P Value"
          style="min-width: 70px"
        ></Column>
        <Column
          field="list_total"
          header="List Total"
          style="min-width: 70px"
        ></Column>
        <Column
          field="pop_hits"
          header="Pop Hits"
          style="min-width: 70px"
        ></Column>
        <Column
          field="pop_total"
          header="Pop Total"
          style="min-width: 70px"
        ></Column>
        <Column
          field="fold_enrichment"
          header="Fold Enrichmemnt"
          style="min-width: 70px"
        >
        </Column>
        <Column
          field="bonferroni"
          header="Bonferroni"
          style="min-width: 70px"
        ></Column>
        <Column
          field="benjamini"
          header="Benjamini"
          style="min-width: 70px"
        ></Column>
        <Column field="FDR" header="FDR" style="min-width: 70px"></Column>
        <template #groupheader="slotProps">
          <span class="p-text-bold">{{ slotProps.data.cluster }}</span>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
export default {
  name: "DavidTable",
  props: ["fileName"],
  setup() {
    const store = useStore();
    const tabledavid = ref();
    const tableData = computed(() => store.state.genesStore.david.data);
    const davidEmpty = computed(() => store.getters.davidDataEmpty);
    const davidLoading = computed(() => store.state.genesStore.david.loading);
    const exportDavid = () => {
      tabledavid.value.exportCSV();
    };

    return {
      davidEmpty,
      davidLoading,
      tableData,
      tabledavid,
      exportDavid,
    };
  },
};
</script>

<style scoped>
.p-divider-solid.p-divider-horizontal {
  margin: 0.3em 0;
  padding: 0 0.9rem;
}

.p-divider-solid.p-divider-horizontal::before {
  border-top-style: none;
}
::v-deep(.p-datatable-header){
  padding: 0 0 65px 0 !important;
}
::v-deep(.p-paginator-current) {
  display:flex;
  justify-content: center;
  margin: 0 !important;
}
::v-deep(.p-paginator-page){
  height: 2rem !important;
  min-width: 2rem !important;
  margin: 0 !important;
}
::v-deep(.p-link){
  height: 2rem !important;
  min-width: 2rem !important;
  margin: 0 !important;
}
::v-deep(.p-paginator-icon){
  height: 2rem !important;
  min-width: 2rem !important;
  margin: 0 !important;
  display:flex;
  justify-content: center;
  align-items: center;
}
::v-deep(.p-paginator-bottom){
  display:flex;
  justify-content: center !important;
  margin: 30px 0 0 0 !important;
  padding: 0 !important;
}
::v-deep(.p-paginator-top .p-paginator-current),
::v-deep(.p-paginator-top .p-link),
::v-deep(.p-paginator-bottom .p-dropdown){
  display:none !important;
}
::v-deep(.p-inputwrapper){
  height: 2em !important;
}
::v-deep(.p-datepicker) {
  min-width: 25rem;  
}
::v-deep(.p-dropdown-label){
  padding: 5px 0;
}
::v-deep(.p-rowgroup-header){
  background: linear-gradient(90deg, rgba(41,20,109,1) 0%, rgba(255,173,14,1) 100%) !important;
}
::v-deep(.p-rowgroup-header .p-text-bold){
  color: white !important;
}
</style>