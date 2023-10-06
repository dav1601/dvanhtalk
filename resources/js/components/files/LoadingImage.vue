<template>
    <div class="wrapper__upload my-4" v-if="size > 0">
        <div
            v-for="(items, type) in groupProgress"
            :key="'stack-progcess-' + type"
        >
            <div
                v-for="(item, key) in items"
                :key="type + '-progress-' + key"
                class="upload_file d-flex align-items-center flex-wrap justify-content-start"
            >
                <div
                    v-if="item.completed !== 100"
                    class="upload_file--item"
                    :class="{ '--single': items.length <= 1 }"
                >
                    <v-progress-circular
                        :value="item.completed"
                        color="primary"
                        class="upload__loader"
                        v-if="item.type != 'audio'"
                    ></v-progress-circular>
                    <img
                        alt="image_loader"
                        v-if="item.type == 'image'"
                        :src="item.url"
                    />
                    <div
                        class="progress__audio d-flex justify-content-start align-items-center"
                        v-if="item.type == 'audio'"
                    >
                        <v-icon dark large>mdi-file-music</v-icon>
                        <v-progress-linear
                            :value="item.completed"
                        ></v-progress-linear>
                    </div>
                    <video v-if="item.type == 'video'">
                        <source :src="item.url" />
                    </video>
                </div>
            </div>
        </div>
    </div>
</template>
<!-- SUY NGHĨ IDEA CHO VIỆC 1 MẢNG PROGCESS CHUNG GROUP BY PROGCESS THEO TYPE-->
<script>
import chat from "../../mixin/servers/chat";
export default {
    props: { stackProgress: { type: Object, default: {} } },
    mixins: [chat],

    computed: {
        size() {
            return Object.keys(this.stackProgress).length;
        },
        groupProgress() {
            return _lodash.groupBy(this.stackProgress, "type");
        },
    },
    created() {},
    mounted() {
        console.log(this.groupProgress);
    },
    methods: {
        renderClass(type) {
            return " --" + type;
        },
    },
    watch: {
        groupProgress(newval) {
            console.log({
                group: newval,
            });
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
