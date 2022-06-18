<template>
    <div class="grouped__msg">
        <div class="pb-4 chat-message-system small">
            {{ formatTime2(groupMsg.created_at) }}
        </div>
        <item-msg
            v-for="(message, key) in groupMsg.messages"
            :key="key"
            :length="groupMsg.messages.length"
            :last="getLast"
            :index="key"
            :data="message"
            :typeUserMsg="type"
            @open-gll="openGll"
            @loaded="loaded"
        ></item-msg>
    </div>
</template>
<script>
import ItemMsg from "../../components/chat/ItemMsg.vue";
import user from "../../mixin/user";
export default {
    props: ["groupMsg", "type", "friendId"],
    emits: ["open-gll"],
    mixins: [user],
    components: {
        ItemMsg,
    },
    computed: {
        getLast() {
            const data = this.groupMsg.messages.filter((el) => {
                return el.sd_id == Number(this.friendId);
            });
            return data[data.length - 1];
        },
    },
    methods: {
        openGll(e) {
            return this.$emit("open-gll", e);
        },
        loaded() {
            return this.$emit("loaded");
        },
    },
};
</script>
<style lang="scss">
.grouped__msg {
    margin-bottom: 12px;
    .chat-message {
        padding-bottom: 4px !important;
    }
}
</style>
