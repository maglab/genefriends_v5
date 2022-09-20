<template>
    <div class="p-d-flex p-jc-start">
        <div class="p-mr-2">
            <div class="p-d-flex p-flex-column">

                <div class="p-mb-2">
                    <h3>Selected gene:</h3>
                    <p>Gene Symbol: {{geneData.node.name}}</p>
                </div>

                <div class="p-mb-2">
                    <h3>Neighbors</h3>
                    <div v-for="(neighbor, index) in geneData.neighbors" :key="index">
                        {{neighbor.name}}
                    </div>
                </div>

                <div>
                    <p>More info...</p>
                </div>

            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: 'GeneCard',
	props: ['geneData'],
    setup(){
        return{  }
    }
}
</script>

<style scoped>
.p-chip.custom-chip {
    background: var(--primary-color);
    color: var(--primary-color-text);    
}
</style>