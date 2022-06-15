<template>
    <div class="reply d-flex" :id="'reply-' + message_parent.id">
        <div
            v-if="message_parent.type == 1"
            class="reply__message chat-item"
            :class="[
                itMe ? ['reply__message--right'] : ['reply__message--left'],
            ]"
        >
            <span class="text-chat text-overflow">
                {{ message_parent.message }}
            </span>
        </div>
        <div
            v-if="message_parent.type == 2"
            class="reply__message--img"
            :class="[
                itMe
                    ? ['reply__message--right --img']
                    : ['reply__message--left --img'],
            ]"
        >
            <img class="img__obj--cover" :src="getImage" @load="loaded" />
        </div>
        <div
            v-if="message_parent.type == 3"
            class="reply__message--audio reply__message"
            :class="[
                itMe ? ['reply__message--right'] : ['reply__message--left'],
            ]"
        >
            <vue-plyr>
                <audio controls crossorigin playsinline>
                    <source
                        :src="message_parent.message"
                        type="audio/mp3"
                        @canplay="loaded"
                    />
                </audio>
            </vue-plyr>
        </div>
    </div>
</template>
<script>
export default {
    props: ["message_parent", "itMe"],
    methods: {
        loaded() {
            return this.$emit("load");
        },
    },
    computed: {
        getImage() {
            const data = this.message_parent.message.split(",");
            return data[0];
        },
    },
};
</script>
<style lang="scss">
.reply {
    img {
        position: relative;
        top: -16px;
        border-radius: 8px;
        margin-left: auto;
        width: 100%;
        max-height: 100%;
    }
    &__message {
        background: #3e4042;
        position: relative;
        top: 8px;
        &--img {
            max-width: 100px;
            max-height: 100px;
        }
        &--audio {
            border-radius: 25px !important;
            .plyr--audio {
                border-radius: inherit;
            }
        }
        &--right {
            margin-left: auto;
            margin-right: 10px;
        }
        &--left {
            margin-right: auto;
            margin-left: 30px;
        }
    }
}
</style>
