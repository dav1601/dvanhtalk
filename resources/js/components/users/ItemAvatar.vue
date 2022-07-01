<template>
    <div :class="[fullWH ? ['w-100', 'h-100'] : '']">
        <img
            v-if="img != null"
            :src="img"
            :alt="username"
            :height="height"
            :width="width"
            class="auth__avatar rounded-circle img__obj--cover"
        />
        <avatar :username="username" :style="style" v-else></avatar>
    </div>
</template>
<script>
import user from "../../mixin/user";
import Avatar from "vue-avatar";
export default {
    components: {
        Avatar,
    },
    props: {
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
    },
    mixins: [user],
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
    },
};
</script>
