<template>
    <div
        class="wp position-absolute cursor-pointer"
        @click.stop="setReactionDialog"
        v-if="reaction != null"
        :class="!itMe ? 'wp-left' : 'wp-right'"
    >
        <div class="d-flex justify-content-end align-items-center wp__reaction">
            <span
                class="wp__rection--item"
                v-for="(icon, index) in reaction"
                :key="'icon-' + index"
                >{{ icon }}</span
            >
            <span class="amount__reaction">
                {{ lengthReaction }}
            </span>
        </div>
    </div>
</template>
<script>
export default {
    props: ["reaction", "itMe", "lengthReaction"],
    computed: {},
    methods: {
        setReactionDialog() {
            this.$emit("set-reaction-dialog");
        },
    },
};
</script>
<style lang="scss" scoped>
.wp-left {
    left: 33px;
}
.amount__reaction {
    display: block;
    font-size: 14px;
    padding-right: 5px;
    margin-left: 2px;
}
.wp-right {
    right: 18px;
}
.wp {
    max-width: 100%;
    bottom: -12px;
    z-index: 50;
    border-radius: 25px;
    background-color: #242526;
    &__reaction {
        flex-wrap: wrap;
        &--item {
            font-size: 16px;
            margin-right: 1px;
        }
    }
}
</style>
