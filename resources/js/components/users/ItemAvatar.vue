<template>
    <div
        :class="[
            fullWH ? ['w-100', 'h-100'] : '',
            showName ? ['fl-center-col'] : '',
        ]"
        class="position-relative"
    >
        <img
            v-if="img != null"
            :src="img"
            :alt="username"
            :height="height"
            :width="width"
            class="auth__avatar rounded-circle img__obj--cover"
        />
        <avatar :username="username" :style="style" v-else></avatar>
        <span
            v-if="showStt"
            class="fas fa-circle position-absolute status"
            :style="styleIconStt"
            :class="[isOnline(userId) ? ['chat-online'] : 'chat-offline']"
        ></span>
        <span
            v-if="showName"
            class="text-center text-overflow"
            :class="classStyleName"
        >
            {{ username }}
        </span>
    </div>
</template>
<script>
import Avatar from "vue-avatar";
export default {
    components: {
        Avatar,
    },
    props: {
        userId: {
            type: [String, Number],
            default: 0,
        },
        height: {
            type: String,
            default: "100%",
        },
        fullWH: {
            type: Boolean,
            default: true,
        },
        width: {
            type: String,
            default: "100%",
        },
        img: {
            type: String,
            default: "",
        },
        username: {
            type: String,
            default: "",
        },
        font: {
            type: String,
            default: "1vw",
        },
        showStt: {
            type: Boolean,
            default: false,
        },
        fontStt: {
            type: String,
            default: "12px",
        },
        showName: {
            type: Boolean,
            default: false,
        },
        classStyleName: {
            type: String,
            default: "",
        },
    },
    computed: {
        style() {
            return (
                "height:" +
                this.height +
                ";" +
                "width:" +
                this.width +
                ";" +
                "font-size:" +
                this.font
            );
        },
        styleIconStt() {
            return "font-size:" + this.fontStt;
        },
    },
};
</script>
<style lang="scss" scoped>
.status {
    bottom: 0;
    right: 0;
}
</style>
