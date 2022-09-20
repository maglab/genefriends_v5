<template>
    <div class="changelog">
        <div class="dash-top" v-if="!first" />
        <div class="dash-bottom" v-if="!last" />
        <div class="with" :class="{ active: first }" />
        <div class="vd">
            <span class="timeline-version">Version {{ version }}</span><br>
            <span class="timeline-date">{{ date }}</span>
        </div>
        <div class="changes timeline-content p-px-3 p-my-5">
            <div class="vd2">
                <span class="timeline-version">Version {{ version }}</span><br>
                <span class="timeline-date">{{ date }}</span>
            </div>
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        first: {
            type: Boolean,
            default: false
        },
        last: {
            type: Boolean,
            default: false
        },
        version: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        }
    }
}
</script>

<style>
    .timeline-version {
        color: var(--main-color);
        font-weight: bold;
    }
    .timeline-date {
        color: var(--main-color);
        font-weight: 300;
    }
    .timeline-content {
        max-width: 330px;
        margin-left: 1em;
    }
    .timeline-content,
    .timeline-content * {
        color: var(--main-color);
    }
    .timeline-content strong,
    .timeline-content b {
        font-weight: bold;
    }
    .changelog{
        display:flex;
        align-items: center;
        position: relative;
    }
    .dash-top,
    .dash-bottom {
        position: absolute;
        width: 1px;
        border-left: 1px dashed #2D2766;
        height: 50%;
        left: 12px;
        margin-top: 1px;
        margin-bottom: 1px;
        z-index: 1;
    }
    .dash-top {
        top: 0;
    }
    .dash-bottom {
        bottom: 0;
    }
    .with.active {
        background-color: var(--main-color);
    }
    .with{
        position: relative;
        flex: 0 0 auto;
        width: 25px;
        height: 25px;
        background-color: #BFB9D5;
        border-radius: 25px;
        z-index: 5;
    }
    .without{
        position: relative;
        flex: 0 0 auto;
        width: 25px;
        height: 25px;
        background: var(--main-color);
        opacity: 1;
        border-radius: 25px;
        z-index: 5;
    }
    .vd{
        width: 120px;
        text-align: center;
        display: none;
    }
    .vd2 {
        width: 120px;
        text-align: left;
        display: block;
    }
    .changes{
        display:inline-block;
        padding-left: 15px;
        border-left: 2px solid var(--main-color);
        text-align: left;
    }

    @media (min-width: 768px) {
        .vd {
            display: block;
        }
        .vd2 {
            display: none;
        }
        .timeline-content {
            margin-left: 2em;
        }
    }
</style>