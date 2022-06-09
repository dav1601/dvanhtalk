<template>
    <div class="d-flex flex-column justify-between" id="messagerMedia">
        <div class="topMedia">
            <agile
                class="mainMedia"
                ref="main"
                style="height: 100%"
                :options="options1"
                :as-nav-for="asNavFor1"
            >
                <div
                    class="slide"
                    v-for="(slide, index) in slides"
                    :key="index"
                    :class="`slide--${index}`"
                >
                    <img :src="slide" />
                </div>
            </agile>
        </div>
        <div class="bottomMedia mt-4">
            <agile
                class="thumbnailsMedia"
                ref="thumbnails"
                :options="options2"
                :as-nav-for="asNavFor2"
                style="height: 40px"
            >
                <div
                    class="slide slide--thumbniail"
                    v-for="(slide, index) in slides"
                    :key="index"
                    :class="`slide--${index}`"
                    @click="$refs.thumbnails.goTo(index)"
                >
                    <img :src="slide" height="100%" width="100%" />
                </div>
            </agile>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            asNavFor1: [],
            asNavFor2: [],
            options1: {
                dots: false,
                fade: true,
                navButtons: false,

            },

            options2: {
                autoplay: false,
                centerMode: true,
                dots: false,
                navButtons: false,
                responsive: [
                    {
                        breakpoint: 600,
                        settings: {
    
                        },
                    },

                    {
                        breakpoint: 1000,
                        settings: {
                            navButtons: true,
                        },
                    },
                ],
            },

            slides: [
                "https://res.cloudinary.com/vanh-tech/image/upload/v1651931247/zz.png",
                "https://images.unsplash.com/photo-1496412705862-e0088f16f791?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
                "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
                "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
                "https://images.unsplash.com/photo-1472926373053-51b220987527?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
                "https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ",
            ],
        };
    },
    mounted() {
        this.asNavFor1.push(this.$refs.thumbnails);
        this.asNavFor2.push(this.$refs.main);
    },
};
</script>

<style lang="scss">
#messagerMedia {
    height: 100vh !important;
}
.slide--thumbniail {
    height: 60px !important;
}

.mainMedia {
    .agile__list {
        height: 100%;
    }
    .agile__track {
        height: 100%;
    }
    .slide {
        display: flex;
        justify-content: center;
        height: auto;
        max-height: 100%;
        img {
            height: auto;
        }
    }
}
.topMedia {
    flex: 0 0 90%;
    height: 90%;
}
.bottomMedia {
    flex: 1;
}
</style>
