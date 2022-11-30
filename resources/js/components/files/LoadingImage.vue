<template lang="">
    <div v-if="haveProgcess" class="wrapper__upload my-4">
        <div
            class="upload_file d-flex align-items-center flex-wrap justify-content-start"
        >
            <div
                class="upload_file--item --single"
                v-for="prc in process"
                :class="renderClass(prc.type)"
            >
                <v-progress-circular
                    :value="prc.process"
                    color="primary"
                    class="upload__loader"
                    v-if="prc.type != 'audio'"
                ></v-progress-circular>
                <img
                    alt="image_loader"
                    v-if="prc.type == 'image'"
                    :src="prc.url"
                />
                <div
                    class="process__audio d-flex justify-content-start align-items-center"
                    v-if="prc.type == 'audio'"
                >
                    <v-icon dark large>mdi-file-music</v-icon>
                    <v-progress-linear :value="prc.process"></v-progress-linear>
                </div>
                <video v-if="prc.type == 'video'">
                    <source :src="prc.url" />
                </video>
            </div>
        </div>
    </div>
</template>
<!-- SUY NGHĨ IDEA CHO VIỆC 1 MẢNG PROGCESS CHUNG GROUP BY PROGCESS THEO TYPE-->
<script>
import chat from "../../mixin/servers/chat";
export default {
    props: {
        process: {
            type: Object,
        },
    },
    mixins: [chat],

    computed: {
        haveProgcess() {
            return Object.keys(this.process).length > 0;
        },
    },

    methods: {
        renderClass(type) {
            return " --" + type;
        },
    },
};
</script>
<style lang="scss">
// .wrapper__upload {
//     flex-direction: row-reverse;
//     margin-left: auto;
// }
.upload__loader {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 500;
}
.upload_file {
    min-width: 300px;
    max-width: 400px;
    max-height: 100% !important;
    flex-direction: row-reverse;
    margin-left: auto;
    border-radius: 8px;
    &--item.--single:not(.--image):not(.--audio) {
        flex: 1 1 250px;
        height: 250px;
        max-width: 250px;
    }
    &--item.--single.--audio {
        flex: 1 1 300px;
        max-width: 300px;
        height: auto;
        margin-bottom: 15px !important;
    }
    &--item.--video.--single {
        flex: 1 1 300px;
        height: 350px;
        max-width: 300px;
    }
    &--item {
        position: relative;
        border-radius: 8px;
        flex: 1 1 125.31px;
        height: 125.31px;
        max-width: 125.31px;
        margin-right: 5px;
        margin-bottom: 10px;
        img,
        video {
            height: 100%;
            width: 100%;
            object-fit: cover;
            border-radius: inherit;
            filter: blur(5px);
            opacity: 0.7;
        }
    }
}
</style>
