<template>
  <div class="gf-container">
    <Card class="p-py-6">
      <template #title> Feel free to contact us anytime :) </template>
      <template #subtitle> </template>
      <template #content>
        <br>
        <section>
          <div class="groups">
            <People
              name="Dr. João Pedro de Magalhães"
              role="Lead Researcher"
              email="j.p.magalhaes@bham.ac.uk"
              image="./img/people/pedro.png"
              researchgate="https://www.researchgate.net/profile/Joao-Pedro-De-Magalhaes"
              linkedin="https://www.linkedin.com/in/joaopedrodemagalhaes/"
              twitter="https://twitter.com/jpsenescence"
              scholar="https://scholar.google.com/citations?user=DZdgRE4AAAAJ&hl=en&oi=sra"
              v-bind:connectsTo="2"
              v-bind:isAccountable="true"
            >
            </People>
          </div>
          <div class="groups">
            <People
              name="Dr. Priyanka Raina"
              role="Postdoctoral Research Associate"
              email="priyankaraina10@gmail.com"
              image="./img/people/priyanka.png"
              researchgate="https://www.researchgate.net/profile/Priyanka-Raina-4"
              linkedin="https://www.linkedin.com/in/priyankaraina10/"
              twitter="https://twitter.com/priyanka1009"
              scholar="https://scholar.google.com/citations?user=iRLb-bwAAAAJ&hl=en"
              v-bind:connectsFrom="1"
              v-bind:connectsTo="2"
              v-bind:isConsulted="true"
            >
            </People>
            <People
              name="Dr. Sipko Van Dam"
              role="Postdoctoral Research Associate"
              email="sipkovandam@gmail.com"
              image="./img/people/sipko.png"
              researchgate="https://www.researchgate.net/profile/Sipko-Dam"
              linkedin="https://www.linkedin.com/in/sipko-van-dam-a9590468/"
              twitter="https://twitter.com/damsipko"
              scholar="https://scholar.google.com/scholar?q=author:%22van%20Dam%20Sipko%22"
              v-bind:connectsFrom="1"
              v-bind:isConsulted="false"
            >
            </People>
          </div>
          <div class="groups">
            <People
              name="MSc. Rodrigo Guinea"
              role="Research Associate"
              email="rodguinea@gmail.com"
              image="./img/people/rodguinea.png"
              researchgate="https://www.researchgate.net/profile/Rodrigo-Guinea"
              linkedin="https://www.linkedin.com/in/rodguinea/"
              twitter="https://twitter.com/rodguinea"
              scholar="https://scholar.google.com/citations?hl=en&user=lx94_Z4AAAAJ"
              v-bind:connectsFrom="1"
              v-bind:connectsTo="2"
              v-bind:isResponsible="true"
            >
            </People>
            <People
              name="MSc. Zoya Farooq"
              role="Research Associate"
              email="zoya.farooq@live.com"
              image="./img/people/zoya.png"
              linkedin="https://www.linkedin.com/in/zfarooq/"
              twitter="https://twitter.com/zoya_ooq"
              v-bind:connectsFrom="1"
            >
            </People>
          </div>

          <div class="groups">
            <People
              name="Ezequiel Regaldo"
              role="Developer Consultant"
              email="regaldo.ezequiel@gmail.com"
              image="./img/people/ezequiel.png"
              linkedin="https://www.linkedin.com/in/ezequiel-regaldo-190aa4119/"
              v-bind:connectsFrom="1"
              v-bind:isVolunteer="true"
            >
            </People>
            <People
              name="Cristina Guinea"
              role="Brand Identity Specialist"
              email="ccguinea@crear.ucal.edu.pe"
              image="./img/people/cristina.png"
              linkedin="https://www.linkedin.com/in/cristina-guinea-ord%C3%B3%C3%B1ez-18b47b3a/"
              v-bind:connectsFrom="1"
              v-bind:isVolunteer="true"
            >
            </People>
          </div>
        </section>
        <br>
        <br>
        <hr />
        <br>
        <h2>Advisory Board</h2>
        <section class="board">
          <figure>
            <img src="../assets/rainer.png" alt="" />
            <figcaption>Dr. Rainer Breitling</figcaption>
          </figure>
          <figure>
            <img src="../assets/brown.png" alt="" />
            <figcaption>Dr. Steve Brown</figcaption>
          </figure>
          <figure>
            <img src="../assets/church.png" alt="" />
            <figcaption>Dr. George Church</figcaption>
          </figure>
          <figure>
            <img src="../assets/horvath.png" alt="" />
            <figcaption>Dr. Steve Horvath</figcaption>
          </figure>
          <figure>
            <img src="../assets/pavlidis.png" alt="" />
            <figcaption>Dr. Paul Pavlidis</figcaption>
          </figure>
          <figure>
            <img src="../assets/freitas.png" alt="" />
            <figcaption>Dr. Alex Freitas</figcaption>
          </figure>
        </section>
      </template>
    </Card>
  </div>
</template>

<script>
import People from "../components/ourteam_components/People.vue";

export default {
  name: "OurTeam",
  components: { People },
  setup() {},
};
</script>

<style scoped>
.advisory-block {
  border-top: 1px solid gray;
  padding-top: 25px;
}
.groups {
  display: flex;
  justify-content: flex-start;
}
.groups:nth-child(2) {
  margin: 0 0 0 60px;
}
.groups:nth-child(3) {
  margin: 0 0 0 120px;
}
.groups:nth-child(4) {
  margin: 0 0 0 180px;
}
.board {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
.board > * {
  max-width: 420px;
}
img {
  max-width: 17em;
}
h2 {
  color: var(--main-color);
}
</style>