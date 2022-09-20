<template>
        <section class="footer-block p-py-6">
            <div class="p-py-6">
                <router-link to="/start/input" style="text-decoration: none;">
                    <Button @click="changeColor()"
                            style="
                                color:white;
                                background: rgb(255, 174, 60);
                                font-size: 1.8em;
                                padding-right: 1.5em;
                                padding-left: 1.5em;
                                padding-top: 0.2em;
                                padding-bottom: 0.2em;
                                text-align: center;
                            "
                            class="p-button-warning p-button-lg"
                            label="Start analysis" />
                </router-link>
            </div>
        </section>
</template>

<script>
export default {
    emits: ['changeColor'],
    setup(props, {emit}) {
        
        const changeColor = () => {
            emit('changeColor')
        }

        return {
            changeColor
        }
    } 
}
</script>

<style scoped>
    .footer-block {
        padding: 5vh 2vw;
        color: white;
        background: url('../../assets/footer.svg');
        background-color: var(--main-color);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% auto;
    }
    section{
        display:flex;
        justify-content:center;
        align-content: center;
        flex-wrap: wrap;

    }
    section:nth-child(1) div:nth-child(1){
        display:flex;
        align-items: center;
    }

    section:nth-child(1) span:nth-child(1) {
        font-size: 2em;
        font-weight: bold;
    }

</style>