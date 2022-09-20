<template>
  <div>
    <Card class="p-py-5">
      <template v-slot:subtitle>
        Pearson correlation input field is only available for single gene
        analysis.
      </template>
      <template v-slot:content>
        <div class="p-grid">
          <div class="p-col-12 p-sm-6">
            <div v-if="formData.flagSingleGene" class="selectors">
              <div class="p-field p-row">
                <label for="threshold"
                  >Pearson Correlation Threshold
                  <i
                    @click="handleInfoClick('pearsonInfo')"
                    class="pi pi-question-circle"
                    style="fontsize: 1rem; cursor: pointer"
                  ></i>
                </label>
              </div>
              <InputText type="text" v-model="threshold" style="width: 100%;" placeholder="0.5" />
              <div>
                <small
                  v-show="validationErrors.thresholdFlag && submitted"
                  class="p-error"
                >
                  A correlation value must be inputted.
                </small>
              </div>
            </div>
            <div v-else class="selectors">
              <div class="p-field p-row" style="color: lightgray">
                <label for="threshold"
                  >Pearson Correlation Threshold
                  <i
                    @click="handleInfoClick('pearsonInfo')"
                    class="pi pi-question-circle"
                    style="fontsize: 1rem; cursor: pointer"
                  ></i>
                </label>
              </div>
              <InputText
                type="text"
                v-model="threshold"
                style="width: 100%"
                disabled
              />
              <div>
                <small
                  v-show="validationErrors.thresholdFlag && submitted"
                  class="p-error"
                >
                  A correlation value must be inputted.
                </small>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
    <div class="text-center" v-if="formData.setupSpinnerEnabled">
      <i class="pi pi-spin pi-spinner" style="fontsize: 1.5rem"></i>
    </div>
    <div v-else>
      <div
        class="p-grid p-nogutter p-justify-between p-mb-3"
        v-if="!formData.setupNextBottomState"
      >
        <Button label="Back" @click="prevPage()" class="gf-button-primary" />
        <Button
          label="Next"
          @click="nextPage()"
          :disabled="!setupReady || formData.included.length==0"
          class="gf-button-primary"
        />
      </div>
      <hr class="p-my-4" />
      <Card>
        <template v-slot:title>
          Are they in our database?
          <i
            @click="handleInfoClick('inDatabase')"
            class="pi pi-question-circle"
            style="fontsize: 1.5rem; cursor: pointer"
          />
        </template>
        <template #subtitle>
          <div v-if="formData.included">
            We have found <strong>{{ formData.included.length }}</strong
            >, out of
            <strong>{{
              formData.included.length + formData.excluded.length
            }}</strong
            >, genes in our database
          </div>
          <div v-else>
            <Skeleton
              class="p-mb-2"
              height="1.2em"
              borderRadius="16px"
            ></Skeleton>
          </div>
        </template>
        <template #content>
          <div class="p-d-flex p-flex-column">
            <div
              class="p-mb-2"
              v-if="Boolean(formData.included) && formData.included.length > 0"
            >
              <Fieldset legend="Yes" :toggleable="true" :collapsed="true">
                <div v-for="(gene, index) in formData.included" :key="index">
                  <a v-if="species == 'ENS'"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="text-decoration: none; color: #5b9ad8"
                    :href="
                      'https://www.ensembl.org/Homo_sapiens/Gene/Idhistory?g=' +
                      gene.split(' : ')[1]
                    "
                  >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>
          <a v-else-if="species == 'ENSMUS'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Mus_musculus/Gene/Idhistory?g=' +
              gene.split(' : ')[1]
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>
          <a v-else-if="species == 'ENSDAR'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Danio_rerio/Gene/Idhistory?g=' +
              gene.split(' : ')[1]
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>
          <a v-else-if="species == 'ENSBTA'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Bos_taurus/Gene/Idhistory?g=' +
              gene.split(' : ')[1]
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>
          <a v-else-if="species == 'ENSRNO'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Rattus_norvegicus/Gene/Idhistory?g=' +
              gene.split(' : ')[1]
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>
          <a v-else-if="species == 'CELE'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Caenorhabditis_elegans/Gene/Idhistory?g=' +
              gene.split(' : ')[1]
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>
          <a v-else-if="species == 'SCER'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Saccharomyces_cerevisiae/Gene/Idhistory?g=' +
              gene.split(' : ')[1]
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>
          <a v-else-if="species == 'ENSGAL'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Gallus_gallus/Gene/Idhistory?g=' +
              gene.split(' : ')[1]
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>

          <a v-else-if="species == 'DMEL'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Drosophila_melanogaster/Gene/Idhistory?g=' +
              gene.split(' : ')[1]
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>
                </div>
              </Fieldset>
            </div>
            <div
              class="p-mb-2"
              v-if="Boolean(formData.excluded) && formData.excluded.length > 0"
            >
              <Fieldset legend="No" :toggleable="true" :collapsed="true">
                <div v-for="(gene, index) in formData.excluded" :key="index">
          <a v-if="species == 'ENS'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Homo_sapiens/Gene/Idhistory?g=' +
              gene
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>
          <a v-else-if="species == 'ENSMUS'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Mus_musculus/Gene/Idhistory?g=' +
              gene
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>
          <a v-else-if="species == 'ENSDAR'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Danio_rerio/Gene/Idhistory?g=' +
              gene
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>
          <a v-else-if="species == 'ENSBTA'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Bos_taurus/Gene/Idhistory?g=' +
              gene
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>
          <a v-else-if="species == 'ENSRNO'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Rattus_norvegicus/Gene/Idhistory?g=' +
              gene
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>
          <a v-else-if="species == 'CELE'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Caenorhabditis_elegans/Gene/Idhistory?g=' +
              gene
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>
          <a v-else-if="species == 'SCER'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Saccharomyces_cerevisiae/Gene/Idhistory?g=' +
              gene
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>
          <a v-else-if="species == 'ENSGAL'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Gallus_gallus/Gene/Idhistory?g=' +
              gene
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>

          <a v-else-if="species == 'DMEL'"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: #5b9ad8"
            :href="
              'https://www.ensembl.org/Drosophila_melanogaster/Gene/Idhistory?g=' +
              gene
            "
          >
              <Chip
                :label="gene"
                class="p-mr-2 p-mb-2"
                style="float: left"
              />
          </a>
                </div>
              </Fieldset>
            </div>
          </div>
        </template>
      </Card>
    </div>
    <Dialog
      header="Information"
      v-model:visible="displayPearsonInfo"
      :modal="true"
      :dismissableMask="true"
    >
      <p>
        When doing single gene analysis, being that a single gene was inputted
        or just one is present in the GeneFriends database, a Pearson
        Correlation threshold must be chosen. This threshold will be used to
        filter out those genes whose correlation value with respect to the seed
        gene is less or equal than it.
      </p>
    </Dialog>
    <Dialog
      header="Information"
      v-model:visible="displayInDatabase"
      :modal="true"
      :dismissableMask="true"
    >
      <p>
        Gene found in our database are displayed using the following convention:
      </p>
      <br />
      <p class="p-text-italic">[query-gene-id]: [ensembl-id]</p>
      <br />
      <p>
        "[query-gene-id]" and "[ensembl-id]" represent the ID, as inputted by
        the user, and the corresponding Ensembl ID present in our database,
        respectively. Now, if [query-gene-id] = [ensembl-id], then only
        [ensembl-id] will be shown.
      </p>
    </Dialog>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from 'vue-router';
export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const formData = computed(() => store.state.genesStore.setup);
    const submitted = ref(false);
    const validationErrors = ref({});
    const threshold = ref();
    const displayInDatabase = ref(false);
    const displayPearsonInfo = ref(false);
    const setupReady = computed(() => store.getters.setupReady);
    const inputData = ref(store.state.genesStore.input);
    const species = ref(inputData.value.species);

    const handleInfoClick = (e) => {
      if (e === "inDatabase") displayInDatabase.value = true;
      if (e === "pearsonInfo") displayPearsonInfo.value = true;
    };

    const validateForm = () => {
      if (threshold.value == "") {
        validationErrors.value["thresholdFlag"] = true;
      } else {
        delete validationErrors.value["thresholdFlag"];
      }

      return !Object.keys(validationErrors.value).length;
    };

    const nextPage = () => {
      submitted.value = true;
      if (validateForm()) {
        store.dispatch("lookForFriends", {
          threshold: Number.parseFloat(threshold.value) || 0.5,
        })
        router.push("/start/results")
      }
    };

    const prevPage = () => {
      router.push("/start/input")
    }

    return {
      setupReady,
      formData,
      nextPage,
      prevPage,
      validationErrors,
      submitted,
      threshold,
      handleInfoClick,
      displayInDatabase,
      displayPearsonInfo,
      species
    };
  },
};
</script>

<style scoped>
.flex-h {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;
}

.cards {
  width: 390px;
  margin: 16px;
}

.p-fieldset p {
  line-height: 1.5;
  margin: 0;
}

p {
  line-height: 1.5;
  margin: 0;
}

.p-fieldset-legend {
  font-size: 1em;
}

legend {
  width: initial !important;
}
.cards.big {
  max-width: 100%;
  width: 100%;
  margin: 16px 0;
}
.selectorsContainer {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.selectors {
  max-width: 320px;
  margin: 0;
}
h3 {
  width: 100%;
  text-align: left;
}
.box-analysis {
  padding-bottom: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}
</style>