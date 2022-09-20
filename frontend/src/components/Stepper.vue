<template>
  <div id="stepper">
    <div :class="current === 'input' ? 'steps active' : 'steps'">
      <span class="title">Input</span>
      <div class="dot"></div>
    </div>
    <div class="line"></div>
    <div :class="current === 'setup' ? 'steps active' : 'steps'">
      <span class="title">Setup</span>
      <div class="dot"></div>
    </div>
    <div class="line"></div>
    <div :class="current === 'results' ? 'steps active' : 'steps'">
      <span class="title">Results</span>
      <div class="dot"></div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    let current = ref("input");

    const router = useRouter();
    router.afterEach((to, from) => {
      if (to.fullPath.includes("/start")) {
        current.value = to.fullPath.split("/")[2];
      }
    });

    return { current };
  },
};
</script>

<style>
#stepper {
  margin: 25px 0 50px 0;
  display: flex;
  width: 100%;
  align-items: center;
}
.steps {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.line {
  width: 100%;
  height: 1px;
  align-self: flex-end;
  margin-bottom: 2px;
  background-color: #eaeaea;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 5px;
  border: 2px solid #bfb9d5;
}
.steps.active .dot {
  background-color: var(--main-color);
  border: 2px solid var(--main-color);
}
.title {
  color: #bfb9d5;
  font-size: 1.2em;
  font-weight: 600;
  margin-bottom: .25em;
}
.steps.active .title {
  color: var(--main-color);
}
</style>