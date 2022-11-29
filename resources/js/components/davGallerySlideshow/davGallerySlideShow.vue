<template>
    <transition name="modal">
        <div class="vgs" v-if="currentFile !== null">
            <!-- <video id="bg__video" v-if="!isImage">
                <source :src="currentFile.url" />
            </video> -->
            <div :class="{ 'vgs-bg': isImage }" :style="styleBackground"></div>
            <v-btn
                class="mx-2 vgs__close"
                fab
                dark
                small
                color="#343a40"
                @click="close"
            >
                <v-icon size="25" dark>mdi-window-close</v-icon>
            </v-btn>
            <button
                v-if="isMultiple"
                type="button"
                class="vgs__prev"
                @click.stop="onPrev"
            >
                <v-icon dark size="35">mdi-chevron-left</v-icon>
            </button>
            <div
                v-if="images"
                class="vgs__container"
                :class="{ '--vid': isVid }"
            >
                <!-- <v-img
                    :lazy-src="currentFile.url"
                    width="100%"
                    :src="currentFile.url"
                ></v-img> -->
                <div class="vgs__container__img">
                    <!-- <v-img :src="currentFile.url"> </v-img> -->
                    <img
                        v-if="isImage"
                        :src="currentFile.url"
                        :alt="currentFile.alt"
                    />
                    <div id="thumb__video" v-if="isVid">
                        <video
                            @play="updateCanvas()"
                            id="gllVideo"
                            controls
                            :src="currentFile.url"
                        ></video>
                        <canvas id="myCanvas"></canvas>
                    </div>
                    <slot></slot>
                </div>
            </div>
            <button
                v-if="isMultiple"
                type="button"
                class="vgs__next"
                @click.stop="onNext"
            >
                <v-icon dark size="35">mdi-chevron-right</v-icon>
            </button>
            <div v-if="isMultiple" ref="gallery" class="vgs__gallery">
                <div v-if="images" class="vgs__gallery__title">
                    {{ imgIndex + 1 }} / {{ images.length }}
                </div>
                <div
                    v-if="images"
                    class="vgs__gallery__container"
                    :style="transformGallery"
                >
                    <div
                        v-for="(img, i) in images"
                        :key="i"
                        class="vgs__gallery__container__img"
                        :style="styleWH"
                        :class="{
                            'vgs__gallery__container__img--active':
                                i === imgIndex,
                        }"
                    >
                        <img
                            :src="typeof img === 'string' ? img : img.url"
                            :data-index="i"
                            :alt="typeof img === 'string' ? '' : img.alt"
                            v-if="img.type == 2"
                            @click.stop="onClickThumb(img, i)"
                        />

                        <div
                            v-else
                            class="file__video w-100 h-100 position-relative"
                            @click.stop="onClickThumb(img, i)"
                        >
                            <div class="poab-c-xy">
                                <v-icon
                                    dark
                                    large
                                    color="#222222"
                                    class="icon__play"
                                    >mdi-play-circle-outline</v-icon
                                >
                            </div>

                            <video>
                                <source
                                    :src="img.url"
                                    :id="'item__id-' + index"
                                />
                            </video>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        images: {
            type: Array,
            required: true,
        },
        index: {
            type: Number,
            required: false,
            default: null,
        },
    },
    data() {
        return {
            imgIndex: 0,
            image: null,
            galleryXPos: 0,
            thumbnailWidth: 100,
            thumbnailHeight: 100,
            transform: 0,
            galleryWidth: 939,
            currentFile: null,
            margin: 10,
            req: null,
        };
    },

    computed: {
        styleWH() {
            const css = {
                width: this.thumbnailWidth + "px",
                height: this.thumbnailHeight + "px",
                "margin-right": this.margin + "px",
            };
            return css;
        },
        isImage() {
            return this.currentFile ? this.currentFile.type == 2 : true;
        },
        isVid() {
            return this.currentFile ? this.currentFile.type == 7 : true;
        },
        styleBackground() {
            const bg = this.currentFile ? this.currentFile.url : "";
            if (this.isImage) {
                return "background-image:url(" + bg + ")";
            }
            return "background: #000000";
        },
        transformGallery() {
            const pos =
                this.galleryXPos > 0 ? -this.galleryXPos : this.galleryXPos;
            return "transform: translate(" + pos + "px, 0)";
        },
        imageUrl() {
            const img = this.images[this.imgIndex];
            if (typeof img === "string") {
                return img;
            }
            if (typeof img !== "undefined") {
                return img.url;
            }
        },
        alt() {
            const img = this.images[this.imgIndex];
            if (typeof img === "object") {
                return img.alt;
            }
            return "";
        },
        isMultiple() {
            return this.images.length > 1;
        },
    },
    watch: {
        imgIndex(v) {
            if (this.req) {
                window.cancelAnimationFrame(this.req);
            }
            if (v != null) {
                this.currentFile = this.images[v];
                if (this.currentFile) {
                    if (this.currentFile.type == 7) {
                        const el = document.getElementById("gllVideo");
                        if (el) {
                            el.load();
                        }
                        this.updateCanvas();
                        this.updateThumbails();
                    }
                }
            }
        },
        index(val, prev) {
            this.imgIndex = val;
            console.log(val);
            // updateThumbails when popup
            if (prev == null && val != null) {
                this.$nextTick(() => {
                    this.updateThumbails();
                });
            }
        },
    },
    updated() {
        this.updateThumbails();
    },
    mounted() {
        window.addEventListener("keydown", (e) => {
            if (e.keyCode === 37) {
                this.onPrev();
            } else if (e.keyCode === 39) {
                this.onNext();
            } else if (e.keyCode === 27) {
                this.close();
            }
        });
    },
    methods: {
        updateCanvas: function () {
            const canvas = document.getElementById("myCanvas");
            const video = document.getElementById("gllVideo");
            const ctx = canvas.getContext("2d");
            const videoDims = {
                width: canvas.offsetWidth,
                height: canvas.offsetHeight,
            };
            console.log({
                draw: "draw",
                video: videoDims,
            });
            ctx.drawImage(video, 0, 0, videoDims.width, videoDims.height);
            if (
                (video) =>
                    !!(
                        video.currentTime > 0 &&
                        !video.paused &&
                        !video.ended &&
                        video.readyState > 2
                    )
            ) {
                this.req = window.requestAnimationFrame(this.updateCanvas);
            }
        },
        getMeta(url, callback) {
            const img = new Image();
            img.src = url;
            img.onload = function () {
                callback(this.width, this.height);
            };
        },
        close() {
            this.imgIndex = null;
            this.$emit("close");
        },
        onPrev() {
            if (this.imgIndex === null) return;
            if (this.imgIndex > 0) {
                this.imgIndex--;
            } else {
                this.imgIndex = this.images.length - 1;
            }
            this.updateThumbails();
        },
        onNext() {
            if (this.imgIndex === null) return;
            if (this.imgIndex < this.images.length - 1) {
                this.imgIndex++;
            } else {
                this.imgIndex = 0;
            }
            console.log(this.imgIndex, this.images.length);
            this.updateThumbails();
        },
        // LÀM CANVAS CHO GLL
        onClickThumb(file, index) {
            this.imgIndex = index;
        },
        updateThumbails() {
            if (!this.$refs.gallery || this.imgIndex === null) {
                return;
            }
            const bonus = this.isIpadProUp
                ? this.thumbnailWidth * 4 - 4 * this.margin
                : this.thumbnailWidth - 20;
            const galleryWidth = document.documentElement.clientWidth;
            const currThumbsWidth = this.imgIndex * this.thumbnailWidth;
            const maxThumbsWidth = this.images.length * this.thumbnailWidth;
            // const lastBonus = this.imgIndex == this.images.length ? 480 : 0;
            // const point = this.isIpadProUp ? 0 : 1000;
            const margin = this.isIpadProUp ? this.imgIndex * this.margin : 0;
            const centerPos =
                Math.floor(galleryWidth / (this.thumbnailWidth * 2)) *
                this.thumbnailWidth;
            // Prevent scrolling of images if not neede

            if (currThumbsWidth < centerPos) {
                this.galleryXPos = 0;
            } else {
                this.galleryXPos = -(currThumbsWidth - bonus + margin);
            }
            console.log({
                c: currThumbsWidth,
                m: margin,
                b: bonus,
                index: this.imgIndex,
            });
        },
    },
};
</script>
<style lang="scss">
$black-alpha-80: rgba(0, 0, 0, 0.8);
$black: #000;
$white: #fff;
$radius-medium: 8px;
$radius-large: 12px;
// Breakpoints
$screen-xs: 480px;
$screen-sm: 768px;
$screen-md: 992px;
$screen-lg: 1200px;
// So media queries don't overlap when required, provide a maximum
$screen-xs-max: ($screen-sm - 1);
$screen-sm-max: ($screen-md - 1);
$screen-md-max: ($screen-lg - 1);
@mixin respond-to($media) {
    @if $media==xs {
        @media (max-width: $screen-xs-max) {
            @content;
        }
    } @else if $media==sm {
        @media (min-width: $screen-sm) and (max-width: $screen-sm-max) {
            @content;
        }
    } @else if $media==md {
        @media (min-width: $screen-md) and (max-width: $screen-md-max) {
            @content;
        }
    } @else if $media==lg {
        @media (min-width: $screen-lg) {
            @content;
        }
    }
}
@mixin modal-base() {
    transition: opacity 0.2s ease;
    position: fixed;
    z-index: 9998;
}
@mixin modal-mask() {
    @include modal-base();
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    height: 100vh;
    display: table;
}
#bg__video {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    filter: blur(20px);
    object-fit: cover;
    opacity: 0.5;
}

.vgs {
    #thumb__video {
        position: relative;
        width: 80vw;
        display: inline-block !important;
        height: calc(100vh - 140px);
        canvas {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            transform: scale(1.25);
            transform-origin: center center;
            filter: blur(70rem);
            opacity: 0.3;
            z-index: -1;
        }
    }

    &-bg {
        position: fixed;
        width: 100vw;
        height: 100vh;
        z-index: -1;
        filter: blur(20px);
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }
    @include modal-mask();
    background: #000;
    &__close {
        position: absolute;
        top: 20px;
        right: 20px;
        cursor: pointer;
        z-index: 999;
    }
    &__prev,
    &__next {
        position: absolute;
        top: 50%;
        margin-top: -25px;
        width: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 48px;
        z-index: 999;
        cursor: pointer;
        font-size: 24px;
        color: #fff;
        background-color: var(--bs-gray-800);
        border: none;
        border-radius: 50%;
        &:hover {
            background-color: var(--bs-gray-900);
        }
    }
    &__prev {
        left: 15px;
    }
    &__next {
        right: 15px;
    }
    &__container.--vid {
        overflow: unset !important;
    }
    &__container {
        position: absolute;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        overflow: hidden;
        margin: 0.5rem auto 0;
        left: 0.5rem;
        right: 0.5rem;
        border-radius: $radius-large;
        // @include respond-to(xs) {
        //     width: 100%;
        //     max-width: 100%;
        //     top: 50%;
        //     margin-top: -140px;
        //     left: 0;
        //     right: 0;
        //     border-radius: 0;
        //     height: 280px;
        // }
        &__img {
            padding-right: 1rem;
            position: relative;
            img {
                height: auto;
                max-height: calc(100vh - 140px);
                max-width: 90vw;
            }
            video {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
    }
}
.vgs__gallery {
    @include respond-to(xs) {
        display: none;
    }
    overflow-x: hidden;
    overflow-y: hidden;
    position: absolute;
    bottom: 10px;
    // max-width: 100vh;
    width: 100%;
    white-space: nowrap;
    left: 0.5rem;
    right: 0.5rem;
    &__title {
        color: $white;
        margin-bottom: 0.5rem;
    }
    &__container {
        overflow: visible;
        // display: flex;
        // justify-content: center;
        display: block;
        height: 100px;
        white-space: nowrap;
        transition: all 200ms ease-in-out;
        width: 100%;
        &__img {
            position: relative;
            opacity: 0.65;
            overflow: hidden;
            display: inline-block;
            img {
                width: 100%;
                height: 100%;
                display: block;
                position: absolute;
                top: 50%;
                left: 50%;
                // max-height: 100%;
                transform: translate(-50%, -50%);
                object-fit: cover;
                object-position: center;
                border-radius: inherit;
            }
            video {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
                border-radius: inherit;
            }
            display: inline-block;
            float: none;
            margin-right: 8px;
            cursor: pointer;
            border-radius: $radius-medium;
        }
        &__img--active {
            width: 100px;
            display: inline-block;
            float: none;
            opacity: 1;
            border: 1px solid #fff;
        }
    }
}
.modal-enter {
    opacity: 0;
}
.modal-leave-active {
    opacity: 0;
}
</style>
