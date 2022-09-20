<template>
  <DataTable
    v-if="singleGene"
    ref="tableCoExpressedGenes"
    :value="tableData"
    v-model:filters="filters"
    :paginator="true"
    class="p-datatable-sm p-px-0"
    columnResizeMode="expand"
    paginatorPosition="both"
    :globalFilterFields="[
      'ensemblid',
      'symbol',
      'biotype',
      'chromosomename',
      'annotation',
      'correlation',
    ]"
    filterDisplay="menu"
    :rows="10"
    :rowsPerPageOptions="[5, 10, 20, 40, 80]"
    responsiveLayout="scroll"
    :exportFilename="fileName"
    sortField="correlation"
    :sortOrder="-1"
    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
  >
    <template #header>
      <div class="p-d-flex p-d-md-none">
        <div class="p-grid">
          <div class="p-col-12">
            <Button
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              class="p-button-outlined"
              style="width: 100%"
            />
          </div>
          <div class="p-col-12">
            <Button
              class="p-button-help"
              icon="pi pi-external-link"
              label="Download CSV"
              style="width: 100%"
              @click="exportCSV($event)"
            />
          </div>
          <div class="p-col-12">
            <Dropdown
              v-model="selectedColumn"
              :options="columns"
              optionLabel="name"
              optionValue="code"
              placeholder="Select an analysis"
              class="gf-button-100"
            />
          </div>
        </div>
      </div>
      <div class="p-jc-between p-d-none p-d-md-flex" style="margin: 10px 0 0 0">
        <div class="p-d-flex p-flex-column p-flex-md-row">
          <div class="p-mb-2 p-mr-2">
            <Button
              class="p-button-help"
              icon="pi pi-external-link"
              label="Download CSV"
              @click="exportCSV($event)"
            />
          </div>
        </div>
      </div>
    </template>
    <Column
      dataType="text"
      field="ensemblid"
      header="Ensembl ID"
      :sortable="true"
    >
      <template #body="slotProps">
        <strong>
          <a v-if="species == 'ENS'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Homo_sapiens/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          <a v-else-if="species == 'ENSMUS'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Mus_musculus/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          <a v-else-if="species == 'ENSDAR'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Danio_rerio/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          <a v-else-if="species == 'ENSBTA'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Bos_taurus/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          <a v-else-if="species == 'ENSRNO'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Rattus_norvegicus/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          <a v-else-if="species == 'CELE'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Caenorhabditis_elegans/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          <a v-else-if="species == 'SCER'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Saccharomyces_cerevisiae/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          <a v-else-if="species == 'ENSGAL'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Gallus_gallus/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          <a v-else-if="species == 'DMEL'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Drosophila_melanogaster/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
        </strong>
      </template>
    </Column>
    <Column
      dataType="text"
      field="symbol"
      header="Gene Symbol"
      :sortable="true"
    ></Column>
    <Column
      dataType="text"
      field="correlation"
      header="Pearson Correlation"
      :sortable="true"
    >
      <template #body="slotProps">
        {{ Math.round(slotProps.data.correlation * 10000)/10000 }}
      </template>
    </Column>
    <Column
      dataType="text"
      field="biotype"
      header="Gene Biotype"
      :sortable="true"
    >
      <template #body="slotProps">
        {{ capitalizeFirstLetter(slotProps.data.biotype.replace('_', ' ')) }}
      </template>
    </Column>
    <Column
      dataType="text"
      field="chromosomename"
      header="Chromosome"
      :sortable="true"
    ></Column>
    <Column dataType="text" field="annotation" header="Annotation"></Column>
  </DataTable>
  <DataTable
    v-else
    ref="tableCoExpressedGenes"
    :value="tableData || []"
    v-model:filters="filters"
    paginatorPosition="both"
    :paginator="true"
    class="p-datatable-sm"
    columnResizeMode="expand"
    :globalFilterFields="[
      'ensemblid',
      'symbol',
      'biotype',
      'geneSetNumber',
      'chromosomename',
      'annotation',
      'totalNumber',
    ]"
    filterDisplay="row"
    :rows="10"
    :rowsPerPageOptions="[5, 10, 20, 40, 80]"
    responsiveLayout="scroll"
    :exportFilename="fileName"
    sortField="pvalue"
    :sortOrder="1"
    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
  >
    <template #header>
      <div class="p-d-flex p-jc-between" style="margin: 10px 0 0 0">
        <div class="p-d-flex p-flex-column p-flex-md-row">
          <div class="p-mb-2 p-mr-2">
            <Button
              class="p-button-help"
              icon="pi pi-external-link"
              label="Download CSV"
              @click="exportCSV($event)"
            />
          </div>
        </div>
      </div>
    </template>

    <Column
      dataType="text"
      field="ensemblid"
      header="Ensembl ID"
      :sortable="true"
    >
      <template #body="slotProps">
        <strong>
          <a v-if="species == 'ENS'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Homo_sapiens/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          <a v-else-if="species == 'ENSMUS'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Mus_musculus/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          <a v-else-if="species == 'ENSDAR'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Danio_rerio/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          <a v-else-if="species == 'ENSBTA'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Bos_taurus/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          <a v-else-if="species == 'ENSRNO'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Rattus_norvegicus/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          <a v-else-if="species == 'CELE'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Caenorhabditis_elegans/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          <a v-else-if="species == 'SCER'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Saccharomyces_cerevisiae/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          <a v-else-if="species == 'ENSGAL'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Gallus_gallus/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          <a v-else-if="species == 'DMEL'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Drosophila_melanogaster/Gene/Idhistory?g=' +
              slotProps.data.ensemblid
            "
          >
            {{ slotProps.data.ensemblid }}
          </a>
          </strong>
      </template>
    </Column>
    <Column
      dataType="text"
      field="symbol"
      header="Gene Symbol"
      :sortable="true"
    >
    </Column>
    <Column dataType="text" header="P-Value" sortable sortField="pvalue">
      <template #body="slotProps">
        {{
          Number.parseFloat(slotProps.data.pvalue)
            .toExponential(4)
            .replace("e", "E")
        }}
      </template>
    </Column>
    <Column dataType="numeric" field="pvalue" :hidden="true"></Column>
    <Column
      dataType="numeric"
      field="geneSetNumber"
      header="Geneset Number"
      :sortable="true"
    ></Column>
    <Column
      dataType="numeric"
      field="totalNumber"
      header="Total Number"
      :sortable="true"
    ></Column>
    <Column
      dataType="text"
      field="biotype"
      header="Gene Biotype"
      :sortable="true"
    >
      <template #body="slotProps">
        {{ capitalizeFirstLetter(slotProps.data.biotype.replace('_', ' ')) }}
      </template>
    </Column>
    <Column
      dataType="text"
      field="chromosomename"
      header="Chromosome"
      :sortable="true"
    ></Column>
    <Column dataType="text" field="annotation" header="Annotation"></Column>
  </DataTable>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { FilterService } from "primevue/api";

export default {
  name: "GenesTable",
  props: ["fileName"],
  setup() {

    const store = useStore();
    const tableData = computed(() => store.state.genesStore.friendsMetadata);
    const inputData = ref(store.state.genesStore.input);
    const species = ref(inputData.value.species);
    //console.log(tableData)
    
    const tableCoExpressedGenes = ref();
    const selectedColumn = ref("ensemblid");

    const singleGene = computed(() => store.getters.singleGene);

    let filters = ref({});
    let columns = ref({});

    if (singleGene.value) {
      filters.value = {
        ensemblid: {
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
        },
        symbol: {
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
        },
        biotype: {
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
        },
        correlation: {
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
        },
        chromosomename: {
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
        },
        annotation: {
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
        },
      };
      columns.value = [
        {
          name: "Ensembl ID",
          code: "ensemblid",
        },
        {
          name: "Gene Symbol",
          code: "symbol",
        },
        {
          name: "Biotype",
          code: "biotype",
        },
        {
          name: "Pearson Correlation",
          conde: "correlation",
        },
        {
          name: "Chromosome",
          code: "chromosomename",
        },
        {
          name: "Annotation",
          code: "annotation",
        },
      ]
    } else {
      filters.value = {
        ensemblid: {
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
        },
        symbol: {
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
        },
        biotype: {
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
        },
        geneSetNumber: {
          value: null,
          matchMode: FilterMatchMode.EQUALS,
        },
        totalNumber: {
          value: null,
          matchMode: FilterMatchMode.EQUALS,
        },
        chromosomename: {
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
        },
        annotation: {
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
        },
      };
      columns.value = [
        {
          name: "Ensembl ID",
          code: "ensemblid",
        },
        {
          name: "Gene Symbol",
          code: "symbol",
        },
        {
          name: "Biotype",
          code: "biotype",
        },
        {
          name: "Gene Set Number",
          code: "geneSetNumber",
        },
        {
          name: "Total Number",
          code: "totalNumber",
        },
        {
          name: "Chromosome",
          code: "chromosomename",
        },
        {
          name: "Annotation",
          code: "annotation",
        },
      ];
    }

    const initFilters = () => {
        if (singleGene.value) {
          filters.value = {
            ensemblid: {
              value: null,
              matchMode: FilterMatchMode.CONTAINS,
            },
            symbol: {
              value: null,
              matchMode: FilterMatchMode.CONTAINS,
            },
            biotype: {
              value: null,
              matchMode: FilterMatchMode.CONTAINS,
            },
            correlation: {
              value: null,
              matchMode: FilterMatchMode.CONTAINS,
            },
            chromosomename: {
              value: null,
              matchMode: FilterMatchMode.CONTAINS,
            },
            annotation: {
              value: null,
              matchMode: FilterMatchMode.CONTAINS,
            },
          };
        } else {
          filters.value = {
            ensemblid: {
              value: null,
              matchMode: FilterMatchMode.CONTAINS,
            },
            symbol: {
              value: null,
              matchMode: FilterMatchMode.CONTAINS,
            },
            biotype: {
              value: null,
              matchMode: FilterMatchMode.CONTAINS,
            },
            geneSetNumber: {
              value: null,
              matchMode: FilterMatchMode.EQUALS,
            },
            totalNumber: {
              value: null,
              matchMode: FilterMatchMode.EQUALS,
            },
            chromosomename: {
              value: null,
              matchMode: FilterMatchMode.CONTAINS,
            },
            annotation: {
              value: null,
              matchMode: FilterMatchMode.CONTAINS,
            },
          };
        }
      };

    FilterService.register("myfilter", (a, b) => a - b);

    const exportCSV = () => {
      
      tableCoExpressedGenes.value.exportCSV();
    };

    const capitalizeFirstLetter = (_string) => {
      return _string.charAt(0).toUpperCase() + _string.slice(1);
    }

    return {
      singleGene,
      species,
      tableData,
      filters,
      tableCoExpressedGenes,
      exportCSV,
      columns,
      capitalizeFirstLetter,
      selectedColumn,
    };
  },
};
</script>

<style scoped>
::v-deep(.p-datatable-header){
  padding: 0 !important;
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
td {
    font-weight: 400;
  }
</style>