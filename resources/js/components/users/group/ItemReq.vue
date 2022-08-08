<template>
    <div
        class="list-group-item list-group-item-action border-0 item-request mb-3"
    >
        <div class="d-flex align-items-center">
            <img
                :src="makeAvatar(request.sender.avatar)"
                class="rounded-circle mr-1 img__obj--cover"
                :alt="request.sender.name"
                width="45"
                height="45"
            />
            <div class="flex-grow-1 ml-3 d-flex flex-column">
                <span class="d-block">{{ request.sender.name }}</span>
                <div class="small text-grey">
                    {{ formatTime(request.created_at) }}
                </div>
            </div>
            <div
                class="flex-grow-1 d-flex justify-content-end gr__req--actions align-items-center"
            >
                <v-btn
                    color="primary"
                    v-if="isManage"
                    :loading="handling"
                    @click="handleRequest('approved')"
                    >Phê Duyệt</v-btn
                >
                <v-btn
                    color="secondary"
                    @click="handleRequest('reject')"
                    v-if="isManage"
                    class="ml-3"
                    :loading="handling"
                    >Từ Chối</v-btn
                >
            </div>
        </div>
    </div>
</template>
<script>
import TheRole from "../../role/TheRole.vue";
export default {
    components: { TheRole },
    props: ["request", "isAdmin", "isManage", "isMod"],
    data() {
        return {
            handling: false,
        };
    },
    async created() {},
    computed: {},
    methods: {
        async handleRequest($status) {
            const data = {
                status: $status,
                req: this.request,
            };
            this.handling = true;
            await this.$store
                .dispatch("users/handleRequest", data)
                .then((req) => {
                    this.handling = false;
                })
                .catch((err) => {
                    this.handling = false;
                });
        },
    },
};
</script>
<style lang="scss" scpoed>
.item-request {
    border-radius: 15px !important;
    background: #272727 !important;
}
</style>
