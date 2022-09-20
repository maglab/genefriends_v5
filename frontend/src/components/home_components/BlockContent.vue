<template>
    <div :class="{ 'p-pb-5': !nopadding }">
        <div class="h2">{{ title }}</div>
        <div class="block-content">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        nopadding: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped>
    .h2 {
        font-weight: bold;
        color: #93C5D9;
        font-size: 1.8em;
    }
    .block-content,
    .block-content * {
        font-weight: initial;
        color: var(--main-color);
        text-align: justify;
    }
    .block-content strong,
    .block-content b {
        font-weight: bold;
    }
</style>