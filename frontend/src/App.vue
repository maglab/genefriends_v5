<template>
    <Toast/>
    <NavBar/>
    <main>
        <router-view/>
    </main>
</template>

<script>
import { watchEffect, computed } from 'vue';
import { useToast } from "primevue/usetoast";
import { useStore } from 'vuex';
import Toast from 'primevue/toast';
import NavBar from './components/NavBar.vue'
export default {
    components: { NavBar, Toast },
    setup() {
        const store = useStore();
        const toast = useToast();

        const notifications = computed(() => store.state.genesStore.notifications)

        watchEffect(() => {
            toast.add({severity:'info', summary: 'Info Message', detail: notifications.value[0], life: 3000});
        })
        
        return {}
    }
}
</script>

<style>
    :root{
        --nav-bar-height: 110px;
        --header-text-color: gray;
        --header-text-size: 1.2em;
        --main-color: rgb(41, 20, 109);
        --result-active-color:  #FFAD0E;
        --color2: green;
        --color3: red;
    }
    html {
        overflow-y: scroll;
    }
    html, body{
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        
        margin: 0;
        padding: 0;
    }
</style>
<style  src="@/assets/css/base.css" />