<template>
    <div class="img__item mb-3 rounded-2" :class="{ iconAdd: icon }">
        <img
            width="100%"
            height="100%"
            class="img__obj--cover"
            :class="'image__preview--' + index"
            alt=""
            v-if="!icon"
        />
        <div
            class="img__item--delete position-absolute"
            v-if="!icon"
            @click="deleteImg()"
        >
            <v-icon dark>mdi-close</v-icon>
        </div>
        <v-icon v-if="icon" size="32" dark>mdi-file-image-plus</v-icon>
    </div>
</template>
<script>
export default {
    props: ["image", "index", "icon"],
    methods: {
        deleteImg() {
            return this.$emit("delete-img-preview", this.index);
        },
    },
};
</script>
<style lang="scss" scoped>
.iconAdd {
    cursor: pointer;
    &:hover {
        background: var(--bs-primary);
    }
}
.img__item {
    flex: 0 0 60px;
    max-width: 60px;
    height: 60px !important;
    position: relative;
    margin-right: 17px;
    background-color: rgba(134, 142, 153, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    img {
        border-radius: inherit;
        width: 100%;
        height: 100%;
    }
    &--delete {
        &:hover {
            background: var(--bs-gray-600);
        }
        cursor: pointer;
        top: -12px;
        right: -12px;
        width: 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--bs-dark);
        border-radius: 50%;
        i {
            font-size: 14px;
        }
    }
}
</style>
