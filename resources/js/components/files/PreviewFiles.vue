<template>
    <div
        class="item__file mb-3 rounded-2"
        :class="renderClass"
        @click.stop="addFile"
    >
        <div class="w-100 h-100 position-relative" v-if="!icon">
            <img
                width="100%"
                :src="url"
                height="100%"
                class="img__obj--cover"
                :class="'image__preview--' + index"
                alt=""
                :id="'item__id-' + index"
                v-if="file.type == 'image'"
            />
            <div
                class="file__video w-100 h-100 position-relative"
                v-if="file.type == 'video'"
            >
                <v-icon
                    dark
                    color="#000000"
                    class="icon__play position-absolute"
                    >mdi-play-circle-outline</v-icon
                >

                <video>
                    <source :src="url" :id="'item__id-' + index" />
                </video>
            </div>

            <div v-if="file.type == 'audio'" class="file__audio">
                <v-btn class="mx-2 file__audio-icon" fab dark small>
                    <v-icon dark> mdi-file-music </v-icon>
                </v-btn>
                <span class="file__audio-name">
                    {{ file.file.name }}
                </span>
            </div>
            <div
                class="item__file--delete position-absolute"
                @click="deleteFile()"
            >
                <v-icon dark>mdi-close</v-icon>
            </div>
        </div>
        <v-icon v-else size="32" dark>mdi-file-image-plus</v-icon>
    </div>
</template>
<script>
export default {
    props: ["file", "icon", "index"],
    data() {
        return {
            url: "",
        };
    },
    computed: {
        renderClass() {
            return this.icon ? "iconAdd" : "item__file-" + this.file.type;
        },
    },
    mounted() {
        if (!this.icon) {
            switch (this.file.type) {
                case "image":
                    this.updateSrcImg();
                    break;
                case "video":
                    this.updateSrcVideo();
                default:
                    break;
            }
        }
    },
    methods: {
        deleteFile() {
            return this.$emit("delete-file", this.index);
        },
        addFile() {
            if (this.icon) {
                return this.$emit("add-file");
            }
            return;
        },
        updateSrcVideo() {
            const source = document.getElementById("item__id-" + this.index);
            this.url = URL.createObjectURL(this.file.file);
        },
        updateSrcImg() {
            let reader = new FileReader();
            const el = document.getElementById("item__id-" + this.index);
            reader.onload = (e) => {
                this.url = reader.result;
            };
            reader.readAsDataURL(this.file.file);
        },
    },
    watch: {
        file(newval) {
            console.log(this.index);
            if (!this.icon) {
                switch (this.file.type) {
                    case "image":
                        this.updateSrcImg();
                        break;
                    case "video":
                        this.updateSrcVideo();
                    default:
                        break;
                }
            }
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
.icon__play {
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    height: 100%;
    font-size: 35px;
}
video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.item__file-audio {
    flex: 0 0 145px !important;
    max-width: 145px !important;
    padding: 2px;
    .file__audio {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        flex-wrap: nowrap;
        height: 100%;
        &-name {
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            display: -webkit-box;
        }
    }
}
.item__file {
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
