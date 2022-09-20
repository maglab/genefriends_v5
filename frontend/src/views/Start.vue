<template>
    <div class="gf-container p-pt-5">
        <Toast />
        <div class="p-d-flex p-flex-column">
            <Stepper/>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

import Stepper from "../components/Stepper.vue";
import {
    useRouter
} from 'vue-router'

export default {
    name: 'Start',
    components: { Stepper },
    setup() {
        const router = useRouter()
        
        window.onload = function () {
            router.push('/start/input')
        }

        return {}
    }
}
</script>

<style scoped>
::v-deep(b) {
    display: block;
}

::v-deep(.p-card-body) {
    padding: 2rem;
}

</style>
<style>

    .p-menuitem-link {
        position: relative;
        width: 24px;
    }
    .p-steps-title {
        position: absolute;
        top: -20px;
        width: 80px;
        text-align: center;
        left: -32px;
        font-weight: bold;
        color: #BFB9D5!important;
    }
    .p-steps-number {
        font-size: 0!important;
        width: 8px!important;
        height: 8px!important;
        min-width: initial!important;
        min-height: initial!important;
        font-size: 0!important;
        line-height: 0!important;
        border: 2px solid var(--main-color)!important;
        background-color: #ffffff!important;
    }
    .p-steps-current > .p-menuitem-link > .p-steps-number {
        background-color: var(--main-color)!important;
    }
    .p-steps-current > .p-menuitem-link > .p-steps-title {
        color: var(--main-color)!important;
    }
</style>