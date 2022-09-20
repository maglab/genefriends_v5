<template>
  <Card>
    <template v-slot:title>
      Let’s begin!
      <Button
        label="Getting Started"
        icon="pi pi-compass"
        @click="openLightboxTutorial"
        class="p-button-outlined p-button-success p-button-sm p-ml-4"
        style="font-size: 0.6rem; padding: 4px; color: #3fc769"
      />
      <a href="https://www.dropbox.com/s/8g3ns5lbr5u7ayz/genefriends_tutorial.pdf?dl=0" target="_blank" rel="noopener noreferrer" style="text-decoration: none"><Button
        label="Download instruction manual"
        icon="pi pi-download"
        class="p-button-outlined p-button-success p-button-sm p-ml-4"
        style="font-size: 0.6rem; padding: 4px; color: #3fc769"
      /></a>
    </template>
    <template v-slot:subtitle> Enter your seed genes </template>
    <template v-slot:content>
      <div class="p-fluid p-grid">
        <div class="p-field p-col-12 p-md-6">
          <label for="species">Species</label>
          <Dropdown
            v-model="selectedSpecies"
            :options="species"
            optionLabel="species"
            optionValue="code"
            placeholder="Select a Species"
            :class="{ 'p-invalid': validationErrors.species && submitted }"
          />
          <small v-show="validationErrors.species && submitted" class="p-error"
            >species is required.</small
          >
        </div>

        <div class="p-field p-col-12 p-md-6">
          <label for="dataSource">
            Data Source
            <i
              @click="handleInfoClick('dataSource')"
              class="pi pi-question-circle"
              style="fontsize: 1rem; cursor: pointer"
            />
          </label>

          <Dialog
            header="Data Source:"
            v-model:visible="displayInDataSource"
            :modal="true"
            :dismissableMask="true"
            :draggable="false"
          >
            <p>
              The human tissue-specific co-expression maps were generated for 20
              tissues from 46080 RNA-seq samples. In case of mouse, 53098
              RNA-seq samples were used to generate 21 tissue-specific
              co-expression maps. The raw read counts were downloaded from
              recount2 (human) and ARCHS4 (mouse) database.
            </p>
            <p>
              The TCGA co-expression map is constructed from 10544 RNA-seq
              samples encompassing samples from 33 cancer types.
            </p>
            <p>
              The GTEx co-expression database is based on 9662 RNA-seq samples
              from 31 tissues. The raw read counts for both TCGA and GTEx
              RNA-seq data were downloaded from recount2 database
              (Collado-Torres et al. 2017).
            </p>
            <p>
			          The Microarray data have been deprecated to use. Please, if you need it, contact Sipko Van Dam (sipkovandam@gmail.com).
            </p>
          </Dialog>

          <Dropdown
            v-model="selectedDataSource"
            :options="dataSources"
            optionLabel="dataSource"
            optionValue="code"
            placeholder="Select data source"
            :disabled="dataSourcesDisabled"
            :class="{ 'p-invalid': validationErrors.dataSource && submitted }"
          />
          <small
            v-show="validationErrors.dataSource && submitted"
            class="p-error"
            >Data source is required.</small
          >
        </div>

        <div class="p-field p-col-12 p-md-6">
          <label for="objectType">Object Type</label>
          <Dropdown
            v-model="selectedObjectType"
            :options="objectTypes"
            optionLabel="objectType"
            placeholder="Select object type"
            :disabled="objectTypesDisabled"
            :class="{ 'p-invalid': validationErrors.objectType && submitted }"
            optionValue="code"
          />
          <small
            v-show="validationErrors.objectType && submitted"
            class="p-error"
            >Object type is required.</small
          >
        </div>

        <div class="p-field p-col-12 p-md-6">
          <label for="tissue">
            Tissue
            <i
              @click="handleInfoClick('tissue')"
              class="pi pi-question-circle"
              style="fontsize: 1rem; cursor: pointer"
            />
          </label>

          <Dialog
            header="Tissues:"
            v-model:visible="displayInTissue"
            :modal="true"
            :dismissableMask="true"
            :draggable="false"
          >
            <p>
              For each tissue co-expression map, the number of genes were
              filtered on the basis of their expression by excluding genes that
              were not expressed in at least 20% of the samples.
            </p>
          </Dialog>

          <Dropdown
            v-model="selectedTissue"
            :options="tissues"
            optionLabel="tissue"
            placeholder="Select tissue"
            :class="{ 'p-invalid': validationErrors.tissue && submitted }"
            optionValue="code"
            :filter="true"
          />
          <small v-show="validationErrors.tissue && submitted" class="p-error"
            >tissue is required.</small
          >
        </div>
      </div>
      <div class="p-field">
        <label for="genes">
          Genes / Transcripts
          <i
            @click="handleInfoClick('gene')"
            class="pi pi-question-circle"
            style="fontsize: 1rem; cursor: pointer"
          />
          <small>* Separate them by a coma or a space</small>
        </label>
        <Dialog
          header="Seed Genes:"
          v-model:visible="displayInGene"
          :modal="true"
          :dismissableMask="true"
          :draggable="false"
        >
          <p>
            Input a gene or list of gene/transcript IDs to obtain co-expressed
            genes/transcripts and their respective functional enrichment. We can
            guess which IDs you are using as long as they are
            <strong>Gene Symbol</strong>, <strong>Ensembl</strong>, or
            <strong>Entrez</strong> IDs. Nevertheless, we only consider genes
            who have an Ensembl ID.
          </p>
        </Dialog>

        <Textarea
          v-model="selectedSeedGenes"
          :autoResize="true"
          rows="5"
          style="min-width: 100%"
          placeholder="Enter Gene Symbols, Ensembl or Entrez IDs"
          :class="{ 'p-invalid': validationErrors.genes && submitted }"
        />
        <small v-show="validationErrors.genes && submitted" class="p-error"
          >genes are required.</small
        >
      </div>
    </template>
  </Card>
  <div class="text-left p-mb-3" style="display:flex; justify-content: space-between">
    <Button label="Example" @click="example()" />
    <Button label="Next" @click="nextPage()" class="gf-button-primary" />
  </div>
  <Dialog
    header="Getting Started"
    :style="{width: '50vw'}"
    v-model:visible="displayTutorial"
    :modal="true"
    position="top"
    :dismissableMask="true"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
    :draggable="false"
  >
    <TabView>
      <TabPanel header="Multiple gene analysis">
        <Card>
          <template #header>
            <Toolbar>
              <template #left>
                <Button icon="pi pi-arrow-left" @click="handleStep(-1)" />
              </template>

              <template #right>
                <Button icon="pi pi-arrow-right" @click="handleStep(1)" />
              </template>
            </Toolbar>
          </template>

          <template #content>
            <picture v-if="step == 0">
              <img src="../../assets/svg/1.svg" alt="" />
            </picture>
            <picture v-if="step == 1">
              <img src="../../assets/svg/2.svg" alt="" />
            </picture>
            <picture v-if="step == 2">
              <img src="../../assets/svg/3.svg" alt="" />
            </picture>
            <picture v-if="step == 3">
              <img src="../../assets/svg/4.svg" alt="" />
            </picture>
            <picture v-if="step == 4">
              <img src="../../assets/svg/5.svg" alt="" />
            </picture>
          </template>
        </Card>
        <div style="display: none">
          <p class="p-text-italic">
            'Tell me who you go with and I'll tell you who you are'
          </p>
          <p>
            This is the core idea behind our analysis. Sometimes one is
            interested in the function of a poorly studied set of genes. The
            GeneFriends
            <i>guilt-by-association approach</i> is useful to find genes strongly
            associated to an arbitrary set of genes, which we call "Seed Genes
            Set". The following is a brief, but comprehensive explanation behind
            the rationale of the GeneFriends analysis.
          </p>
          <p>
            First, let us consider those genes present in our database. For each
            one of those, RNA Seq expression data is used to calculate its
            <strong
              ><a
                target="_blank"
                rel="noopener noreferrer"
                style="color: black"
                href="https://coxpresdb.jp/static/help/mr.shtml"
                >mutual rank</a
              ></strong
            >
            with respect to every other one in the database, and a sorted list
            in ascending order of the top 5% is associated to each of those.
            Thus, each gene is associated to a <strong>list</strong> of the top
            5% genes by mutual rank. The total number of friends for a
            particular gene is defined as the number of
            <strong>lists</strong> (each one associated to a gene in the
            database) in which this gene is present. Therefore, one gene is
            friend of another if, and only if, it is the former is present in
            the latters associated list. That is,
            <i
              >your friends are only those that 'like' you (i.e., have you in
              their associated list)</i
            >.
          </p>
          <p>
            Now, let us imagine there is a need to learn more about WRN, PROP1,
            FLOT1 and ENSG00000000003 (i.e., Seed Gene Set).
          </p>
          <p>
            First, since only Ensembl identifiers (IDs) are considered, the
            corresponding Ensembl IDs are looked for using the myGene Python
            library. That is, for WRN, the corresponding Ensembl ID would be
            ENSG00000165392; for PROP1, ENSG00000175325, ENSG00000274382 and
            ENSG00000280635; for FLOT1, ENSG00000232280, ENSG00000206379,
            ENSG00000236271 and ENSG00000206480; and for ENSG00000000003,
            ENSG00000000003 itself.
          </p>
          <p>
            Second, for each Seed Gene, we check which of its corresponding
            Ensembl IDs is present in our database. For WRN, that would be
            ENSG00000165392; for PROP1, ENSG00000236271; and for
            ENSG00000000003, ENSG00000000003 itself. In our example, no Ensembl
            ID associated to PROP1 was found in our database. Thus,
            ENSG00000165392, ENSG00000236271 and ENSG00000000003 will go
            downstream in our analysis.
          </p>
          <p>
            Third, the number of times each gene in our database is present in
            the
            <strong>lists</strong> associated to the Seed Genes (i.e., number of
            friends in the Seed Gene Set) is counted. This number will be called
            the <i>Gene Set Number</i>, or <i>A</i>, for short. Hence, an
            <i>A</i> is associated to each gene in the database, including those
            in the Seed Gene set. In the context of this analysis, the
            <i>A</i> of a gene represents the number of friends it has in the
            Seed Gene set.
          </p>
          <p>
            Finally, for each gene present in the database, a single number is
            computed to measure its strength of association to the Seed Gene set
            (ENSG00000165392, ENSG00000236271 and ENSG00000000003, in this
            example). For a particular gene, this number is defined as the
            probability of it having by chance alone a number of friends in the
            Seed Gene set equal or greater than its <i>A</i>. Strictly speaking,
            this number is the <strong>p-value</strong> on A of a binomial
            distribution with probability of success <i>pi</i> equal to
            <i>A</i> divided by the Total Number of Friends <i>T</i> of the
            particular gene in case; and the number of trials, equal to the
            number of Seed Genes.
          </p>
        </div>
      </TabPanel>

      <TabPanel header="Single gene analysis">
        <p>
          Now, when you only want information about a single gene (Seed Gene)
          the <strong>p-value</strong>, as calculated in the
          <i>many gene analysis</i>, turn meaningless, since the Gene Set Number
          (<i>A</i>) can, exclusively, now be either 1 or 0. Therefore, once the
          corresponding Ensembl ID is identified, only those genes in the data
          base with calculated <i>A</i> equal to 1 (one) are displayed and
          sorted by pearson correlation with respect to the seed gene inputted
          by the user.
        </p>
      </TabPanel>

      <TabPanel header="DAVID functional annotations">
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://david.ncifcrf.gov/"
            >David Functional Annotations</a
          >
          are done on friends and Seed Genes.
        </p>
      </TabPanel>
    </TabView>
  </Dialog>
</template>

<script>
import { onMounted, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const submitted = ref(false);
    const validationErrors = ref({});
    const displayTutorial = ref(false);

    const openLightboxTutorial = () => {
      displayTutorial.value = true;
    };

    const handleStep = (_e) => {
      step.value = step.value + _e;
      if (step.value < 0) step.value = 0;
      if (step.value > 3) step.value = 4;
    };

    const selectedSpecies = ref("ENS");
    const selectedDataSource = ref("SRA");
    const selectedObjectType = ref("G");
    const selectedTissue = ref("0");
    const selectedSeedGenes = ref("");
    const dataSourcesDisabled = ref(false);
    const objectTypesDisabled = ref(false);
    const displayInDataSource = ref(false);
    const displayInTissue = ref(false);
    const displayInGene = ref(false);
    const step = ref(0);

    selectedSpecies.value = store.state.genesStore.input.species;
    selectedDataSource.value = store.state.genesStore.input.dataSource;
    selectedObjectType.value = store.state.genesStore.input.selectedObjectType;
    selectedTissue.value = store.state.genesStore.input.selectedTissue;
    selectedSeedGenes.value = store.state.genesStore.input.seedGenes;
    selectedSeedGenes.value = store.state.genesStore.input.selectedSeedGenes;

    const handleInfoClick = (e) => {
      if (e === "dataSource") displayInDataSource.value = true;
      if (e === "tissue") displayInTissue.value = true;
      if (e === "gene") displayInGene.value = true;
    };

    const species = ref([
      {
        species: "Bos Taurus (Cattle)",
        code: "ENSBTA",
      },
      {
        species: "Caenorhabditis elegans (Roundworm)",
        code: "CELE",
      },
      {
        species: "Danio rerio (Zebrafish)",
        code: "ENSDAR",
      },
      {
        species: "Drosophila melanogaster (Fruit fly)",
        code: "DMEL",
      },
      {
        species: "Gallus gallus (Red junglefowl)",
        code: "ENSGAL",
      },
      {
        species: "Homo sapiens (Human)",
        code: "ENS",
      },
      {
        species: "Mus musculus (Mouse)",
        code: "ENSMUS",
      },
      {
        species: "Saccharomyces cerevisiae (Yeast)",
        code: "SCER",
      },
      {
        species: "Rattus norvegicus (Brown rat)",
        code: "ENSRNO",
      }
    ]);

    const tissues = ref();
    const objectTypes = ref([
      {
        objectType: "Genes",
        code: "G",
      },
      {
        objectType: "Transcripts",
        code: "T",
      },
    ]);
    const dataSources = ref([
      {
        dataSource: "SRA",
        code: "SRA",
      },
      {
        dataSource: "GTEx",
        code: "GTEX",
      },
      {
        dataSource: "TCGA",
        code: "TCGA",
      },
    ]);

    watchEffect(() => {
      if (selectedSpecies.value === "ENS") {
        dataSourcesDisabled.value = false;

        if (selectedDataSource.value === "SRA") {
          objectTypesDisabled.value = false;
          if (selectedObjectType.value === "G") {
            tissues.value = [
              { tissue: "All Tissues", code: "0" },
              { tissue: "Adipose", code: "1" },
              { tissue: "Bone", code: "2" },
              { tissue: "Bone marrow", code: "3" },
              { tissue: "Brain", code: "4" },
              { tissue: "Breast", code: "5" },
              { tissue: "Esophagus", code: "6" },
              { tissue: "Heart", code: "7" },
              { tissue: "Kidney", code: "8" },
              { tissue: "Liver", code: "9" },
              { tissue: "Lung", code: "10" },
              { tissue: "Muscle", code: "11" },
              { tissue: "Neuron", code: "12" },
              { tissue: "Ovary", code: "13" },
              { tissue: "Pancreas", code: "14" },
              { tissue: "Prostate", code: "15" },
              { tissue: "Retina", code: "16" },
              { tissue: "Skin", code: "17" },
              { tissue: "Small Intestine", code: "18" },
              { tissue: "Spleen", code: "19" },
              { tissue: "Testis", code: "20" },
            ];
          } else if (selectedObjectType.value === "T") {
            selectedTissue.value = "0";
            tissues.value = [{ tissue: "All Tissues", code: "0" }];
          }
        } else if (selectedDataSource.value === "GTEX") {
          objectTypesDisabled.value = true;
          selectedObjectType.value = "G";
          selectedTissue.value = "0";
          tissues.value = [{ tissue: "All Tissues", code: "0" }];
        } else if (selectedDataSource.value === "TCGA") {
          objectTypesDisabled.value = true;
          selectedObjectType.value = "G";
          selectedTissue.value = "0";
          tissues.value = [{ tissue: "All Tissues", code: "0" }];
        }
      } else if (selectedSpecies.value === "ENSMUS") {
        dataSourcesDisabled.value = true;
        objectTypesDisabled.value = false;
        selectedDataSource.value = "SRA";

        if (selectedObjectType.value === "G") {
          tissues.value = [
            { tissue: "All Tissues", code: "0" },
            { tissue: "Adipose", code: "1" },
            { tissue: "Bone", code: "2" },
            { tissue: "Bone marrow", code: "3" },
            { tissue: "Brain", code: "4" },
            { tissue: "Breast", code: "5" },
            { tissue: "Heart", code: "6" },
            { tissue: "Intestine", code: "7" },
            { tissue: "Islets", code: "8" },
            { tissue: "Kidney", code: "9" },
            { tissue: "Liver", code: "10" },
            { tissue: "Lung", code: "11" },
            { tissue: "Lymphoid", code: "12" },
            { tissue: "Muscle", code: "13" },
            { tissue: "Myeloid", code: "14" },
            { tissue: "Neuron", code: "15" },
            { tissue: "Ovary", code: "16" },
            { tissue: "Retina", code: "17" },
            { tissue: "Skin", code: "18" },
            { tissue: "Spleen", code: "19" },
            { tissue: "Testis", code: "20" },
            { tissue: "Thymus", code: "21" },
          ];
        } else if (selectedObjectType.value === "T") {
          selectedTissue.value = "0";
          tissues.value = [{ tissue: "All Tissues", code: "0" }];
        }
      } else if (selectedSpecies.value === "ENSBTA") {
        dataSourcesDisabled.value = true;
        selectedDataSource.value = "SRA";
        objectTypesDisabled.value = true;
        selectedObjectType.value = "G";

        if (selectedObjectType.value === "G") {
          tissues.value = [{ tissue: "All Tissues", code: "0" }];
        }
      } else if (selectedSpecies.value === "ENSDAR") {
        dataSourcesDisabled.value = true;
        selectedDataSource.value = "SRA";
        objectTypesDisabled.value = true;
        selectedObjectType.value = "G";

        if (selectedObjectType.value === "G") {
          tissues.value = [{ tissue: "All Tissues", code: "0" }];
        }
      } else if (selectedSpecies.value === "ENSGAL") {
        dataSourcesDisabled.value = true;
        selectedDataSource.value = "SRA";
        objectTypesDisabled.value = true;
        selectedObjectType.value = "G";

        if (selectedObjectType.value === "G") {
          tissues.value = [{ tissue: "All Tissues", code: "0" }];
        }
      } else if (selectedSpecies.value === "ENSRNO") {
        dataSourcesDisabled.value = true;
        selectedDataSource.value = "SRA";
        objectTypesDisabled.value = true;
        selectedObjectType.value = "G";

        if (selectedObjectType.value === "G") {
          tissues.value = [{ tissue: "All Tissues", code: "0" }];
        }
      } else if (selectedSpecies.value === "CELE") {
        dataSourcesDisabled.value = true;
        selectedDataSource.value = "SRA";
        objectTypesDisabled.value = true;
        selectedObjectType.value = "G";

        if (selectedObjectType.value === "G") {
          tissues.value = [{ tissue: "All Tissues", code: "0" }];
        }
      } else if (selectedSpecies.value === "DMEL") {
        dataSourcesDisabled.value = true;
        selectedDataSource.value = "SRA";
        objectTypesDisabled.value = true;
        selectedObjectType.value = "G";

        if (selectedObjectType.value === "G") {
          tissues.value = [{ tissue: "All Tissues", code: "0" }];
        }
      } else if (selectedSpecies.value === "SCER") {
        dataSourcesDisabled.value = true;
        selectedDataSource.value = "SRA";
        objectTypesDisabled.value = true;
        selectedObjectType.value = "G";

        if (selectedObjectType.value === "G") {
          tissues.value = [{ tissue: "All Tissues", code: "0" }];
        }
      }
    });

    const example = () => {
      if (selectedSpecies.value === "ENS" && selectedObjectType.value === "G") {
        selectedSeedGenes.value = "ENSG00000146670, ENSG00000089685, ENSG00000100297, ENSG00000134690, ENSG00000051180, ENSG00000171848, ENSG00000132436, ENSG00000169679, ENSG00000134057, ENSG00000178999, ENSG00000184445, ENSG00000094804"
      } else if (selectedSpecies.value === "ENSMUS" && selectedObjectType.value === "G") {
        selectedSeedGenes.value = "23834, 18140, 19361, 268697, 60530, 52276, 20135, 11799, 67849, 20877, 208628, 17218, 12235"
      } else if (selectedSpecies.value === "ENSBTA") {
        selectedSeedGenes.value = "ENSBTAG00000000005, ENSBTAG00000000008, ENSBTAG00000000009, ENSBTAG00000000010, ENSBTAG00000000011, ENSBTAG00000000012, ENSBTAG00000000013, ENSBTAG00000000014, ENSBTAG00000000015, ENSBTAG00000000016, ENSBTAG00000000019"
      } else if (selectedSpecies.value === "ENSDAR") {
        selectedSeedGenes.value = "ENSDARG00000000474, ENSDARG00000000476, ENSDARG00000000489, ENSDARG00000000503, ENSDARG00000000516, ENSDARG00000000529, ENSDARG00000000540, ENSDARG00000000542, ENSDARG00000000551, ENSDARG00000000563, ENSDARG00000000567, ENSDARG00000000568"
      } else if (selectedSpecies.value === "ENSGAL") {
        selectedSeedGenes.value = "ENSGALG00000000154, ENSGALG00000000156, ENSGALG00000000158, ENSGALG00000000161, ENSGALG00000000162, ENSGALG00000000164, ENSGALG00000000168, ENSGALG00000000172, ENSGALG00000000184, ENSGALG00000000186, ENSGALG00000000189, ENSGALG00000000195"
      } else if (selectedSpecies.value === "ENSRNO") {
        selectedSeedGenes.value = "ENSRNOG00000004101, ENSRNOG00000037850, ENSRNOG00000039592, ENSRNOG00000048966, ENSRNOG00000046262, ENSRNOG00000003688, ENSRNOG00000042394, ENSRNOG00000004692, ENSRNOG00000033195, ENSRNOG00000028896, ENSRNOG00000007247, ENSRNOG00000005935"
      } else if (selectedSpecies.value === "SCER") {
        selectedSeedGenes.value = "Q0045, Q0050, Q0055, Q0060, Q0065, Q0070, Q0075, Q0080, Q0085, Q0105, Q0110, Q0115, Q0120"
      } else if (selectedSpecies.value === "CELE") {
        selectedSeedGenes.value = "WBGene00000001, WBGene00000002, WBGene00000003, WBGene00000004, WBGene00000005, WBGene00000006, WBGene00000007, WBGene00000008, WBGene00000009, WBGene00000010, WBGene00000012, WBGene00000017"
      } else if (selectedSpecies.value === "DMEL") {
        selectedSeedGenes.value = "FBgn0000022, FBgn0000024, FBgn0000028, FBgn0000032, FBgn0000036, FBgn0000037, FBgn0000038, FBgn0000039, FBgn0000042, FBgn0000043, FBgn0000044, FBgn0000045"
      } else if (selectedSpecies.value === "ENS" && selectedObjectType.value === "T") {
        selectedSeedGenes.value = "ENST00000392415, ENST00000571150, ENST00000292363, ENST00000558530, ENST00000410646, ENST00000423936, ENST00000506106, ENST00000576854, ENST00000598376, ENST00000372870, ENST00000320095, ENST00000305202"
      } else if (selectedSpecies.value === "ENSMUS" && selectedObjectType.value === "T") {
        selectedSeedGenes.value = "ENSMUST00000185197, ENSMUST00000040210, ENSMUST00000062750, ENSMUST00000134845, ENSMUST00000129373, ENSMUST00000070758, ENSMUST00000164725, ENSMUST00000153843, ENSMUST00000000228, ENSMUST00000125565, ENSMUST00000139574, ENSMUST00000049346"
      }

    }

    const nextPage = () => {
      submitted.value = true;

      if (validateForm()) {
        store.dispatch("saveInput", {
          species: selectedSpecies.value,
          dataSource: selectedDataSource.value,
          tissue: selectedObjectType.value + selectedTissue.value,
          objectType: selectedObjectType.value,
          seedGenes: selectedSeedGenes.value
            .replace(/['"]+/g, "")
            .split(/[\s ,;\t\n]+/)
            .filter((n) => n),
          selectedObjectType: selectedObjectType.value,
          selectedTissue: selectedTissue.value,
          selectedSeedGenes: selectedSeedGenes.value,
        });
        store.dispatch("clearSetup");
        router.push("/start/setup");
      }
    };

    const validateForm = () => {
      if (!selectedSpecies.value.trim())
        validationErrors.value["species"] = true;
      else delete validationErrors.value["species"];

      if (!selectedDataSource.value.trim())
        validationErrors.value["dataSource"] = true;
      else delete validationErrors.value["dataSource"];

      if (!selectedObjectType.value.trim())
        validationErrors.value["objectType"] = true;
      else delete validationErrors.value["objectType"];

      if (!selectedTissue.value.trim()) validationErrors.value["tissue"] = true;
      else delete validationErrors.value["tissue"];

      if (!selectedSeedGenes.value.trim())
        validationErrors.value["genes"] = true;
      else delete validationErrors.value["genes"];

      return !Object.keys(validationErrors.value).length;
    };

    return {
      step,
      submitted,
      validationErrors,
      nextPage,
      species,
      tissues,
      selectedSpecies,
      selectedTissue,
      selectedSeedGenes,
      selectedDataSource,
      dataSources,
      dataSourcesDisabled,
      selectedObjectType,
      objectTypes,
      handleInfoClick,
      displayTutorial,
      openLightboxTutorial,
      displayInDataSource,
      displayInTissue,
      displayInGene,
      objectTypesDisabled,
      handleStep,
      example
    };
  },
};
</script>

<style scoped>
.p-inputtext::placeholder {
  color: var(--main-color) !important;
}
</style>