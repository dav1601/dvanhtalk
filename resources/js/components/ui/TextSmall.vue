<template>
    <span>{{ text }}</span>
</template>
<script>
export default {
    props: ["text"],
};
</script>
<style lang="scss" scoped>
span {
    display: block;
    color: #b0b3b8;
    font-size: 12.9999999px;
    line-height: 16.0004px;
    padding: 0px 0px 1px;
    text-align: center;
}
</style>
