<template>
        <section class="header-block1">
            <div class="gf-container section p-my-5 p-py-5 p-jc-center p-jc-sm-between">
                <div>
                    <h1 class="text-center text-sm-left"><span style="font-size: 1.2em; font-weight: 600;">We use <br> Guilt-by-association <br> approach</span></h1>
                </div>
                <div class="grants">
                    <div>
                        <span>Grants</span>
                        <span><i>Funded by</i></span>
                    </div>
                    <div>
                        <a target="_blank" rel="noopener noreferrer" href="https://wellcome.org/"><img src="../../assets/wellcometrust.png" style="height: 5rem; margin-bottom: 15px" /></a> 
                        <a target="_blank" rel="noopener noreferrer" href="https://bbsrc.ukri.org/"><img src="../../assets/biocouncil.png" style="height: 5rem" /></a>
                    </div>
                </div>
            </div>
        </section>
        <section class="header-block2">
            <div class="gf-container section p-my-5 p-py-5 text-center text-sm-left">
                <h2>GeneFriends is a bioinformatic tool used to:</h2>
                <div class="p-grid p-py-3">
                    <div class="p-col-12 p-sm-4">
                        <figcaption><strong>Assign</strong> putative functions to poorly annotated genes/features</figcaption>
                    </div>
                    <div class="p-col-12 p-sm-4">
                        <figcaption><strong>Identify and rank</strong> new candidate genes/features related to a disease or biological process from a seed list of genes/features</figcaption>
                    </div>
                    <div class="p-col-12 p-sm-4">
                    </div>
                    <div class="p-col-12">
                        <router-link to="/start/input" style="
                                        color:white;
                                        background:rgb(255, 174, 60);
                                        font-size:1.2em;
                                        padding-right:1.5em;
                                        padding-left:1.5em;
                                        padding-top:0.2em;
                                        padding-bottom:0.2em;
                                        text-align: center;
                                        text-decoration:none;
                                        border-radius:5px;
                                        font-weight:600;
                                    "
                                    class="p-button-warning p-button-lg">
                                    <span class="p-button-label">Start analysis</span>
                        </router-link>
                        <a href="https://www.dropbox.com/sh/jz0z3z8fuhx70fx/AACt3CUvyro2cEETVBoWwIrNa?dl=0" target="_blank" style="
                                        color:white;
                                        background:rgb(255, 174, 60);
                                        font-size:1.2em;
                                        padding-right:1.5em;
                                        padding-left:1.5em;
                                        padding-top:0.2em;
                                        padding-bottom:0.2em;
                                        text-align: center;
                                        text-decoration:none;
                                        border-radius:5px;
                                        font-weight:600;
                                        margin-left: 10px
                                    "
                                    class="p-button-warning p-button-lg">
                                    <span class="p-button-label">Download data</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
</template>

<script>
export default {

}
</script>

<style scoped>
    .header-block1 {
        color: var(--main-color);
        background-color: var(--main-color);
        background: url('../../assets/banner1.svg');
        background-repeat: no-repeat;
        background-position: 23% 100%;
        background-size: auto 100%;
    }
    .header-block2 {
        color: white;
        background-image: linear-gradient(rgb(148,198,218),rgb(41, 20, 109));
    }
    h1{
        font-size: 2.6em;
    }
    h2{
        width: 100%;
    }
    section, .section {
        display:flex;
        flex-wrap: wrap;

    }
    img{
        min-width: 70px;
        height: 70px;
    }
    figure{
        display:flex;
        align-items: center;
        max-width: 350px;
    }
    .grants{
        display: flex;
        align-items: center;

    }
    .grants > div{
        display:flex;
        flex-direction: column;
        padding: 2vh 2vw;
    }
    .grants > div:nth-child(1){
        font-size: 1.4em;
        align-items: center;
    }
    .grants > div:nth-child(1) > span:nth-child(1){
        font-size: 1.7em;
        font-weight: bold;
    }
    .grants > div:nth-child(2){
        border-left: 2px dashed var(--main-color);
    }
    
</style>