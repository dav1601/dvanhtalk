<template>
    <div class="grouped__msg">
        <div class="pb-4 chat-message-system small" v-if="!checkAllSystemMsg">
            {{ handleTime(false) }}
        </div>
        <div v-if="type == 0">
            <item-msg
                v-for="(message, key) in groupMsg.messages"
                :key="key"
                :length="groupMsg.messages.length"
                :last="getLast"
                :lastMe="getLastMe"
                :index="key"
                :data="message"
                :typeUserMsg="type"
                :LT="handleTime(true)"
                @open-gll="openGll"
                @loaded="loaded"
                :allSystemMsg="checkAllSystemMsg"
            ></item-msg>
        </div>
        <div v-if="type == 1">
            <div
                v-for="(messages, index) in userGroupMsg"
                :key="'user-messages-group-' + index"
            >
                <div class="mt-2">
                    <item-msg
                        v-for="(message, key) in messages"
                        :key="'user-message-group-key-' + key"
                        :length="messages.length"
                        :last="getLastMsgGroup(messages)"
                        :lastMe="null"
                        :index="key"
                        :data="message"
                        :typeUserMsg="type"
                        @open-gll="openGll"
                        @loaded="loaded"
                        :allSystemMsg="checkAllSystemMsg"
                    ></item-msg>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ItemMsg from "../../components/chat/ItemMsg.vue";
export default {
    props: ["groupMsg", "type", "friendId"],
    emits: ["open-gll"],
    components: {
        ItemMsg,
    },
    computed: {
        setBlockLoadImg() {
            return this.$store.getters["message/setBlockLoadImg"];
        },
        getLast() {
            const data = this.groupMsg.messages.filter((el) => {
                return el.sd_id == Number(this.friendId);
            });
            if (!data) {
                return null;
            }
            return data[data.length - 1];
        },
        getLastMe() {
            const data = this.groupMsg.messages.filter((el) => {
                return el.sd_id != Number(this.friendId);
            });
            if (!data) {
                return null;
            }
            return data[data.length - 1];
        },
        userGroupMsg() {
            // Nhóm những tin nhắn theo người gửi
            if (this.type == 1) {
                const groupedUserMsgGroup = this.groupMsg.messages.reduce(
                    (messages, message) => {
                        const group = messages[message.sd_id] || [];
                        group.push(message);
                        messages[message.sd_id] = group;
                        return messages;
                    },
                    {}
                );
                return groupedUserMsgGroup;
            }
            return null;
        },
        checkAllSystemMsg() {
            const check = this.groupMsg.messages.find((el) => {
                return Number(el.type_msg) != 4;
            });
            if (check) {
                return false;
            }
            return true;
        },
    },
    methods: {
        getLastMsgGroup(arrayMessages) {
            return arrayMessages[arrayMessages.length - 1];
        },

        openGll(e) {
            return this.$emit("open-gll", e);
        },
        loaded(sd_id) {
            return this.$emit("loaded", sd_id);
        },
        handleTime(noPrefix = false) {
            const MSGTIME = this.$moment(this.groupMsg.created_at);
            const NOW = this.$moment();
            const TODAY = MSGTIME.clone().startOf("day");
            const ISTODAY = NOW.isSame(TODAY, "d");
            const YESTERDAY = MSGTIME.clone()
                .subtract(1, "days")
                .startOf("day");
            const ISYESTERDAY = NOW.isSame(YESTERDAY, "d");
            if (ISTODAY) {
                return "Hôm nay " + MSGTIME.format("LT");
            }
            if (ISYESTERDAY) {
                return "Hôm qua " + MSGTIME.format("LT");
            }
            if (noPrefix) {
                return MSGTIME.format("LT");
            }
            return this.formatTime2(this.groupMsg.created_at);
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
