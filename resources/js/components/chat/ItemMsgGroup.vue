<template>
    <div
        class="pb-4"
        :class="[itMe ? ['chat-message-right'] : ['chat-message-left']]"
    >
        <div
            :class="[!itMe ? ['d-flex flex-column align-items-center'] : ['']]"
        >
            <img
                :src="itMe ? avatar : makeAvatar(receiver.avatar)"
                class="rounded-circle mr-1"
                alt="Chris Wood"
                width="45"
                height="45"
            />
            <div
                class="text-muted small text-nowrap mt-2"
                :class="[itMe ? [''] : ['mx-2']]"
            >
                {{ formatTime(data.message.created_at) }}
            </div>
        </div>

        <div
            class="flex-shrink-1 bg-light rounded px-3 py-2 mr-3 chat-item"
            :class="[itMe ? ['me-chat'] : ['friend-chat']]"
            v-if="type == 1"
        >
            <div v-if="typeUserMsg == 1" class="font-weight-bold mb-1 name-rcv">
                {{ itMe ? "You" : data.sender.name }}
            </div>
            {{ data.message.message }}
        </div>
        <div
            class="flex-shrink-1 bg-light rounded px-2 py-2 mr-3"
            :style="createBackgroundImage"
            v-if="type == 2"
        >
            <img
                :src="data.message.message"
                alt="message image"
                @load="loaded"
            />
        </div>
        <div
            :style="createBgAudio"
            class="flex-shrink-1 bg-light rounded px-1 py-1 mr-3"
            v-if="type == 3"
        >
            <vuetify-audio
                :file="data.message.message"
                color="primary"
                downloadable
                :canPlay="loaded"
            ></vuetify-audio>
        </div>
    </div>
</template>
<script>
export default {
    props: ["data", "receiver", "role"],
    components: {
        VuetifyAudio: () => import("vuetify-audio"),
    },
    computed: {
        createBackgroundImage() {
            return (
                "background-image: radial-gradient(circle, rgba(0, 0, 0, 0) 25%, rgba(24, 24, 24, 1) 75%),url(" +
                this.data.message.message +
                ");background-size: cover;"
            );
        },
        createBgAudio() {
            return "background-image: radial-gradient(circle, rgba(0, 0, 0, 0) 25%, rgba(24, 24, 24, 1) 75%);background-size: cover;";
        },
        itMe() {
            return this.data.sd_id == this.authId;
        },
        isGroup() {
            return this.typeUserMsg == 1;
        },
        type() {
            return this.data.message.type;
        },
    },
    methods: {
        formatTime($time) {
            var d = new Date($time);
            return d.toLocaleTimeString();
        },
        loaded() {
            return this.$emit("loaded");
        },
    },
};
</script>
<style scoped>
img {
    max-width: 350px;
    max-height: 350px;
}
.chat-item {
    border-radius: 8px !important;
}
.friend-chat .name-rcv {
    font-weight: 600;
    background-image: linear-gradient(
        68.1deg,
        rgba(61, 114, 180, 1) 5.8%,
        rgba(82, 82, 82, 1) 98.1%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.me-chat .name-rcv {
    background-color: #52acff;
    background-image: linear-gradient(180deg, #52acff 25%, #ffe32c 100%);

    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
}
.friend-chat {
    background-color: #8bc6ec !important;
    background-image: linear-gradient(
        135deg,
        #8bc6ec 0%,
        #9599e2 100%
    ) !important;
}
.me-chat {
    background-color: #ff9a8b !important;
    background-image: linear-gradient(
        90deg,
        #ff9a8b 0%,
        #ff6a88 55%,
        #ff99ac 100%
    ) !important;
}
</style>
