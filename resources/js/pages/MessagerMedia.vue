<template>
    <dav-gallery-slide-show
        :images="slides"
        :index="start"
        @close="close"
        v-show="!loading"
    ></dav-gallery-slide-show>
</template>

<script>
import davGallerySlideShow from "../components/davGallerySlideshow/davGallerySlideShow.vue";
export default {
    components: {
        davGallerySlideShow,
    },
    data() {
        return {
            rcvId: this.$route.query.thread_id,
            msgId: this.$route.query.message_id,
            index: this.$route.query.attachment_id,
            type: this.$route.query.type,
            transform: 0,
            updated: 0,
            loading: false,
        };
    },
    created() {
        this.getMessengerMedia();
    },

    mounted() {
    },
    computed: {
        slides() {
            return this.$store.getters["message/messengerMedia"];
        },
        start() {
            return this.$store.getters["message/startMessengerMedia"];
        },
    },
    methods: {
        updateSlide() {
            this.updated += 1;
            if (this.updated == 1) {
                const el = document.getElementsByClassName(
                    "vgs__gallery__container"
                )[0];
            }
        },
        close() {
            // return this.$router.push({
            //     name: "chat",
            //     params: { friendId: this.rcvId },
            //     query: { uid: this.rcvId },
            // });
            return this.$router.back();
        },
        async getMessengerMedia() {
            this.loading = true;
            await this.$store
                .dispatch("message/getMessengerMedia", {
                    receiverId: this.rcvId,
                    index: this.index,
                    msgId: this.$CryptoJS.AES.decrypt(
                        this.msgId,
                        "Secret ID"
                    ).toString(this.CryptoJS.enc.Utf8),
                    type: this.type,
                })
                .then((req) => {
                    this.loading = false;
                    this.transform = Math.floor(req.data.start / 8);
                })
                .catch((err) => {});
        },
    },
};
</script>

<style lang="scss">
.vgs__container {
    height: 80vh !important;
    background: none !important;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
        width: auto;
        height: auto;
        max-height: 100%;
    }
}
</style>
