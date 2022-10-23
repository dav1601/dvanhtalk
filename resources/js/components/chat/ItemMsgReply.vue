<template>
    <div
        class="reply d-flex"
        :id="'reply-' + message_parent.id"
        :class="[itMe ? ['chat-message-right'] : ['chat-message-left']]"
    >
        <div
            v-if="message_parent.type == 1"
            class="reply__message chat-item cursor-pointer"
            @click="setActiveReply"
            :class="[
                itMe ? ['reply__message--right'] : ['reply__message--left'],
            ]"
        >
            <!-- VIẾT SỰ KIỆN CLICK NỮA LÀ XONG NHA BÀ -->
            <span class="text-chat text-overflow">
                {{ message_parent.message }}
            </span>
        </div>
        <div
            v-if="message_parent.type == 2"
            class="reply__message--img cursor-pointer"
            @click="setActiveReply"
            :class="[
                itMe
                    ? ['reply__message--right --img']
                    : ['reply__message--left --img'],
            ]"
        >
            <v-img
                :src="getImage"
                height="100px"
                width="100px"
                style="border-raidus: 8px"
            ></v-img>
            <!-- <img class="img__obj--cover" :src="getImage"  /> -->
        </div>
        <div
            v-if="message_parent.type == 3"
            class="reply__message chat-item cursor-pointer"
            @click="setActiveReply"
            :class="[
                itMe ? ['reply__message--right'] : ['reply__message--left'],
            ]"
        >
            <v-icon dark class="mr-1">mdi-book-music</v-icon>
            <span class="text-chat text-overflow"> File âm thanh </span>
        </div>
        <div
            v-if="message_parent.type == 6"
            class="reply__message chat-item cursor-pointer"
            @click="setActiveReply"
            :class="[
                itMe ? ['reply__message--right'] : ['reply__message--left'],
            ]"
        >
            <v-icon dark class="mr-1">mdi-record-rec</v-icon>
            <span class="text-chat text-overflow"> File thu âm </span>
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
        async setActiveReply() {
            await this.$store.commit(
                "message/setActiveReply",
                this.message_parent.id
            );
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
        top: 10px;
        border-radius: 8px;
        margin-left: auto;
        width: 100%;
        height: 100%;
    }
    &__message {
        background: #3e4042;
        position: relative;
        top: 8px;
        max-width: 414px;

        &--img {
            position: relative;
            top: 8px;
            .v-image {
                border-radius: 8px;
            }
            width: 100px;
            height: 100px;
        }
        &--audio {
            border-radius: 25px !important;
            .plyr--audio {
                border-radius: inherit;
            }
        }
        &--right {
            margin-left: auto;
            margin-right: 35px;
        }
        &--left {
            margin-right: auto;
            margin-left: 35px;
        }
    }
}
</style>
