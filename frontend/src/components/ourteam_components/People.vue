<template>
  <div class="people-wrapper">
    <div class="connectionsFrom">
      <div class="connectionFrom" v-for="n in connectsFrom" :key="n"></div>
    </div>
    <div class="people">
      <div
        class="fixed-data"
          @click="toggle"
        :style="{ background: open ? 'white' : 'lightblue' }"
      >
        <h3>{{ name }}</h3>
        <p>{{ role }}</p>
        <i v-if="isResponsible"><strong>Responsible / Developer</strong></i>
        <i v-else-if="isVolunteer"><strong>Volunteer</strong></i>
        <i v-else-if="isAccountable"><strong>Accountable</strong></i>
        <i v-else-if="isConsulted"><strong>Consulted</strong></i>
        <i v-else><span>&nbsp</span></i>
        <div
          class="people-toggle-button"
          :class="open ? 'open' : ''"
        ></div>
      </div>
      <div class="accordion-data" :style="{ height: open ? '0px' : '150px' }">
        <img class="img-profile" :src="image" alt="" />
        <div class="contact">
          <span
            ><strong>Email:</strong> <br /><a href="mailto:{{email}}">{{
              email
            }}</a></span
          >
          <span class="social">
            <a v-if="researchgate" :href="researchgate" target="_blank"
              ><img src="../../assets/researchgate.png" alt=""
            /></a>
            <a v-if="linkedin" :href="linkedin" target="_blank"
              ><img src="../../assets/linkedin.png" alt=""
            /></a>
            <a v-if="twitter" :href="twitter" target="_blank"
              ><img src="../../assets/twitter.png" alt=""
            /></a>
            <a v-if="scholar" :href="scholar" target="_blank"
              ><img src="../../assets/scholar.png" alt=""
            /></a>
          </span>
        </div>
      </div>
    </div>
    <div class="connectionsTo">
      <div v-if="connectsTo" class="connectionBar"></div>
      <div class="to">
        <div class="connectionTo" v-for="n in connectsTo" :key="n"></div>
        <div class="invisibleConn" v-if="connectsTo === 0"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  props: {
    name: {
      type: String,
      default: false,
    },
    role: {
      type: String,
      default: " ",
    },
    email: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    researchgate: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
    scholar: {
      type: String,
      default: "",
    },
    connectsFrom: {
      type: Number,
      default: 0,
    },
    connectsTo: {
      type: Number,
      default: 0,
    },
    isVolunteer: {
      type: Boolean,
      default: false,
    },
    isConsulted: {
      type: Boolean,
      default: false,
    },
    isAccountable: {
      type: Boolean,
      default: false,
    },
    isResponsible: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    let open = ref(true);
    function toggle() {
      open.value = !open.value;
    }

    return { open, toggle };
  },
};
</script>

<style scoped>
.people-wrapper {
  margin: 0 10px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.people {
  max-height: 278px;
  width: 400px;
  margin: 0 0 0px 0;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  background: white;
  border: 2px solid lightblue
}
.connectionsFrom {
  max-width: 400px;
  display: flex;
  justify-content: center;
}
.connectionFrom {
  width: 2px;
  height: 40px;
  background: lightblue;
  position: relative;
}
.connectionFrom::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: -4px;
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background: lightblue;
}
.connectionsTo {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.connectionTo {
  left: 200px;
  bottom: 0;
  width: 60px;
  height: 2px;
  background: lightblue;
  position: absolute;
}
.connectionTo:nth-child(2),
.connectionTo:nth-child(3) {
  right: 0;
  width: 481px;
}
.to {
  display: flex;
}
.invisibleConn{
  height: 40px;
  width: 1px;
}
.connectionBar {
  width: 2px;
  min-height: 40px;
  height: 100%;
  background: lightblue;
  position: relative;
  bottom: 0px;
  left: 0;
  z-index: 1;
}
.fixed-data {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 5px 5px 0px 0px;
  transition: all 1s ease;
  z-index: 2;
}
.fixed-data h3,
p,
i {
  color: var(--main-color);
  margin: 0 0 0 15px;
}
span {
  color: var(--main-color);
}
.fixed-data h3 {
  padding-top: 15px;
}
.accordion-data {
  display: flex;
  align-items: center;
  overflow: hidden;
  transition: all 0.5s ease-in-out;
  z-index: 2;
}
.people-toggle-button {
  cursor: pointer;
  height: 30px;
  width: 30px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  margin: 5px;
}
.people-toggle-button::before,
.people-toggle-button::after {
  content: "";
  background: white;
  transition: all 1s ease;
}
.open.people-toggle-button::before,
.open.people-toggle-button::after {
  content: "";
  background: lightblue;
}
.people-toggle-button::before {
  content: "";
  width: 20px;
  height: 4px;
}
.open.people-toggle-button::after {
  position: absolute;
  content: "";
  height: 20px;
  width: 4px;
}
.contact {
  display: flex;
  flex-direction: column;
}
.contact > * {
  margin: 5px;
}
.accordion-data > img {
  width: 150px;
  height: 150px;
  border-radius: 150px;
}
.social img {
  width: 40px;
  height: 40px;
  padding: 0.1em;
}
a {
  text-decoration: none;
}

.img-profile {
  padding: 0.5em;
}
</style>