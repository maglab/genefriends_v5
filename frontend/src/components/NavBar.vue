<template>
    <div class="bg-menu gf-container-full">
        <div class="gf-container">
            <div id="menu" >
                <figure>
                    <router-link @click="closeMenu" to="/"><img src="../assets/logo.svg" style="width: 130px; height: auto;" /></router-link>
                </figure>
                <div id="toggle-btn" @click.prevent="toggle">
                    <div :style="{ transform : open ? 'rotate(43deg) translateX(0px)' : 'rotate(0deg)' }" class="top-bar-line"></div>
                    <div :style="{ opacity : open ? 0 : 1 }" class="top-bar-line"></div>
                    <div :style="{ transform : open ? 'rotate(-43deg) translateX(0px)' : 'rotate(0deg)' }" class="top-bar-line"></div>
                </div>
                <nav :style="{ right: open ? '0' : '-100%' }">
                    <router-link @click="closeMenu" to="/">Home</router-link>
                    <router-link @click="closeMenu" :class="selected ? 'router-link-active' : ''" to="/start/input">Start Analysis</router-link>
                    <router-link @click="closeMenu" to="/references">References</router-link>
                    <router-link @click="closeMenu" to="/team">Our Team</router-link>
                    <router-link @click="closeMenu" to="/saved">Saved Results</router-link>
<!--                     <a href="http://178.79.139.157:9999/microArray/">Microarray</a> -->
<!--                     <router-link @click="closeMenu" to="/deprecated">Microarray</router-link> -->
                </nav>
            </div>
        </div>
    </div>
    
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router'

export default {
    setup(){

        const selected = ref(false)
        
        const router = useRouter()

        router.afterEach((to, from) => {
            selected.value = to.fullPath.includes("/start")
        })

        let open = ref(false);
        function toggle(){
            open.value = !open.value
        }
        function closeMenu() {
            open.value = false
        }

        return { open, toggle, closeMenu, selected }
    }
}
</script>

<style scoped>

    .router-link-active {
        color: rgb(255, 174, 60);
        /* letter-spacing: 0.016em; */
        font-weight: bold;
        /* padding-right: 1em; */
    }

    nav a {
        color: white;
        font-weight: bold;
        padding-right: 1em;

    }

    .particular {
        color:rgb(148, 198, 218);
        letter-spacing: 0.016em;
        font-weight: bold;
    }

    figure {
        display:flex;
        align-items: center;
        margin: 0;
    }

    figcaption {
        font-weight: 800;
        font-size: 1.4em;
        color: white;
        font-weight: 600;
    }

    .bg-menu {
        background-color: rgb(41, 20, 109);
        padding: 0;
    }
    #menu{
        display:flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 400;
        padding: 0;
        height: var(--nav-bar-height);
    }

    nav{
        display:flex;
        justify-content: center;
        align-content: center;
    }

    a, a:visited{
        display: flex;
        padding: 15px 5px;
        text-decoration: none;
        font-size: var(--header-text-size);
        box-sizing: border-box;
        letter-spacing: 1px;
        
    }

    @media (min-width: 830px){
        #toggle-btn{
            display:none
        }
    }

    @media (max-width: 830px) {
        #toggle-btn{
            display:flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            width: 40px;
            height: 35px;
            box-sizing: border-box;
            cursor: pointer;
            border-radius: 5px;
            padding: 5px;
        }
        #toggle-btn .top-bar-line{
            position: relative;
            display: flex;
            width: 100%;
            height: 5px;
            transform-origin: left;
            transition: all .5s ease;
            border-radius: 5px;
            background: var(--surface-a);
        }
        nav{
            flex-direction: column;
            position: fixed;
            transition: all .3s ease-in-out;
            top: var(--nav-bar-height);
            width: 50%;
            background: white;
            z-index: 9999;
            height: calc( 100vh - var(--nav-bar-height) );
            background-color: rgb(41, 20, 109);
        }
  }
</style>