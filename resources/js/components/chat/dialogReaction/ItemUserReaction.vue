<template>
    <div class="user__reaction d-flex justify-content-between align-center">
        <div class="user__reaction--avatar">
            <img
                :src="makeAvatar(data.user.avatar)"
                class="rounded-circle img__obj--cover"
                alt=""
                width="50"
                height="50"
            />
        </div>
        <div
            class="user__reaction--cap d-flex flex-column justify-content-center px-3"
            @click="removeReaction"
        >
            <span class="name">{{ data.user.name }}</span>
            <span class="note" v-if="meReaction">Nhấp để gỡ</span>
        </div>
        <div class="user__reaction--icon">{{ data.reaction }}</div>
    </div>
</template>
<script>
export default {
    props: ["data", "type"],
    computed: {
        meReaction() {
            return this.authId == this.data.user.id;
        },
    },
    methods: {
        async removeReaction() {
            if (!this.meReaction) {
                return;
            }
            await this.$store
                .dispatch("message/saveReaction", {
                    msgId: this.data.message_id,
                    actions: "delete",
                })
                .then((req) => {})
                .catch((err) => {
                    this.$emit("error-api", "Thả cảm xúc tin nhắn thất bại 😞");
                });
        },
    },
};
</script>
<style lang="scss" scoped>
.user__reaction {
    cursor: pointer;
    &:hover {
        background: #242526;
    }
    padding: 5px;
    border-radius: 8px;
    margin: 0 5px;
    &--cap {
        padding-top: 5px;
        flex: 1;
        font-size: 15px;
        .name {
            color: #fff;
        }
        .note {
            color: #b0b3b8;
        }
    }
    &--icon {
        font-size: 25px;
        padding-top: 5px;
    }
}
</style>
