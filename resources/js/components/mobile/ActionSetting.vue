<template>
    <div class="d-flex align-items-center justify-content-start mobile__action">
        <v-icon :size="size" :color="color">{{ icon }}</v-icon>
        <div class="ml-2">
            <span class="d-block mobile__action--name">{{ actionName }}</span>
            <span v-if="status != null" class="mobile__action--stt mt-1">
                {{ status }}
            </span>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        size: {
            type: [Number, String],
            default: 16,
        },
        color: {
            type: String,
            default: "primary",
        },
        icon: {
            type: String,
            default: "mdi-alert-circle",
        },
        status: {
            type: String,
            default: null,
        },
        actionName: {
            type: String,
            default: "No Name",
        },
    },
};
</script>
<style lang="scss" scoped>
.mobile__action {
    &--name {
        color: var(--bs-gray-100);
        font-weight: 600;
        font-size: 15px;
    }
    &--stt {
        font-size: 12px;
        color: var(--bs-gray-500);
    }
}
</style>
