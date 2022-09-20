<template>
  <Toast />
  <div class="gf-container">
    <Card class="p-py-6">
      <template #title> References </template>
      <template #subtitle> </template>
      <template #content>
          <div class="refContainer">
            <Accordion :multiple="true" :activeIndex="[0]">
              <AccordionTab>
                <template #header>
                  <div>
                    <strong class="p-pr-2">GeneFriends 2021: </strong
                    ><br class="br-xs" />
                    Updated co-expression databases and tools for human and
                    mouse genes and transcripts
                  </div>
                </template>
                <pre>
<!-- <code>
Raina P, Guinea R, Chatsirisupachai K, Lopes I, Farooq Z, Guinea C, Solyom C,  de Magalhães JP. GeneFriends 2021: Updated co-expression databases and tools for human and mouse genes and transcripts. Biorxiv, 2021 
<a target="_blank" rel="noopener noreferrer" href="https://www.biorxiv.org/content/10.1101/2021.01.10.426125v1">[bioRxiv]</a>
</code> -->
<code>
Raina P, Lopes I, Chatsirisupachai K, Farooq Z, de Magalhães JP. GeneFriends 2021: Updated co-expression databases and tools for human and mouse genes and transcripts. Biorxiv, 2021 
<a target="_blank" rel="noopener noreferrer" href="https://www.biorxiv.org/content/10.1101/2021.01.10.426125v1">[bioRxiv]</a>
</code>
                            </pre>
              </AccordionTab>
            </Accordion>

            <Button
              icon="pi pi-copy"
              class="p-button-text p-button-lg"
              @click.prevent="doCopyref2"
              style="color: #ffffff"
            />
            <Accordion>
              <AccordionTab>
                <template #header>
                  <div>
                    <strong class="p-pr-2">GeneFriends: </strong
                    ><br class="br-xs" />
                    a human RNA-seq-based gene and transcript co-expression
                    database
                  </div>
                </template>
                <pre>
<code>
Van Dam S, Craig T, de Magalhães JP. GeneFriends: a human RNA-seq-based gene and transcript co-expression database. Nucleic Acids Res. 
2015 Jan 28; 43 (Database issue) 
<a target="_blank" rel="noopener noreferrer" href="https://pubmed.ncbi.nlm.nih.gov/25361971/">[PubMed]</a>
</code>
                                        </pre>
              </AccordionTab>
            </Accordion>

            <Button
              icon="pi pi-copy"
              class="p-button-text p-button-lg"
              @click.prevent="doCopyref1"
              style="color: #ffffff"
            />
          </div>
      </template>
    </Card>
  </div>
</template>
<script>
import { copyText } from "vue3-clipboard";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
export default {
  name: "References",
  setup() {
    const toast = useToast();
/*     const ref1 = ref(`@article{Raina2021,
                          doi = {10.1101/2021.01.10.426125},
                          url = {https://doi.org/10.1101/2021.01.10.426125},
                          year = {2021},
                          month = jan,
                          publisher = {Cold Spring Harbor Laboratory},
                          author = {Priyanka Raina and Rodrigo Guinea and Kasit Chatsirisupachai and In{\^{e}}s Lopes and Zoya Farooq and Cristina Guinea and Csaba-Attila Solyom and Jo{\~{a}}o Pedro de Magalh{\~{a}}es},
                          title = {{GeneFriends} 2021: Updated co-expression databases and tools for human and mouse genes and transcripts}
                        }`); */

const ref1 = ref(`@article{Raina2021,
                          doi = {10.1101/2021.01.10.426125},
                          url = {https://doi.org/10.1101/2021.01.10.426125},
                          year = {2021},
                          month = jan,
                          publisher = {Cold Spring Harbor Laboratory},
                          author = {Priyanka Raina and In{\^{e}}s Lopes and Kasit Chatsirisupachai and Zoya Farooq and Jo{\~{a}}o Pedro de Magalh{\~{a}}es},
                          title = {{GeneFriends} 2021: Updated co-expression databases and tools for human and mouse genes and transcripts}
                        }`);

    const ref2 = ref(`@article{vanDam2014,
                          doi = {10.1093/nar/gku1042},
                          url = {https://doi.org/10.1093/nar/gku1042},
                          year = {2014},
                          month = oct,
                          publisher = {Oxford University Press ({OUP})},
                          volume = {43},
                          number = {D1},
                          pages = {D1124--D1132},
                          author = {Sipko van~Dam and Thomas Craig and Jo{\~{a}}o Pedro de Magalh{\~{a}}es},
                          title = {{GeneFriends}: a human {RNA}-seq-based gene and transcript co-expression database},
                          journal = {Nucleic Acids Research}
                        }`);

    const doCopyref1 = () => {
      copyText(ref1.value, undefined, (error, event) => {
        if (error) {
          alert("Can not copy");
          console.log(error);
        } else {
          toast.add({
            severity: "success",
            summary: "Copied!",
            detail: "BibteX copied to clipboard",
            life: 3000,
          });
        }
      });
    };

    const doCopyref2 = () => {
      copyText(ref2.value, undefined, (error, event) => {
        if (error) {
          alert("Can not copy");
          console.log(error);
        } else {
          toast.add({
            severity: "success",
            summary: "Copied!",
            detail: "BibteX copied to clipboard",
            life: 3000,
          });
        }
      });
    };

    return {
      doCopyref1,
      doCopyref2,
    };
  },
};
</script>

<style scoped>
.refContainer {
  display:grid;
  grid-template-columns: 90% 1fr;
  gap: 10px;
  justify-items: top;
  align-items: top;
}
.p-accordion p {
  line-height: 1.5;
  margin: 0;
}
.p-button{
  height: 52px;
  width: 52px;
  background: lightblue !important;
}
pre {
  overflow: auto;
  background-color: #ffffff;
}
</style>