<template>
    <div
        class="list-group-item list-group-item-action border-0 card-group mb-2"
        v-if="!isLoading"
        :to="{
            name: 'group',
            params: { friendId: group.id },
            query: { uid: group.id },
        }"
    >
        <div class="d-flex align-items-center justify-content-between">
            <div
                class="group-info d-flex align-items-center justify-content-start flex-grow-1"
            >
                <img
                    :src="makeAvatar(group.group_image)"
                    class="group-image mr-1 img__obj--cover"
                    alt="Vanessa Tucker"
                    width="120"
                    height="120"
                />
                <div class="flex-grow-1 ml-3">
                    <span class="d-block group-name text-overflow">{{
                        group.name
                    }}</span>
                    <div
                        class="small d-flex justify-content-lg-start align-items-center"
                    >
                        <span class="d-block">Owner:</span>
                        <item-avatar
                            :fullWH="false"
                            class="ml-3 mr-1"
                            :username="group.founder.name"
                            width="20px"
                            height="20px"
                            :img="group.founder.avatar"
                        ></item-avatar>
                        <span class="d-block text-overflow" style="flex: 1">{{
                            group.founder.name
                        }}</span>
                    </div>
                </div>
            </div>
            <div
                class="group-action d-flex justify-content-end align-items-center"
            >
                <v-btn
                    :link="true"
                    :to="{ name: 'group', params: { friendId: group.id } }"
                    v-if="inGroup || statusRequest == 2"
                    rounded
                    color="primary"
                    dark
                >
                    Vào Nhóm
                </v-btn>
                <v-btn
                    v-if="!request && !inGroup"
                    @click="sendRequest"
                    rounded
                    color="#263238"
                    :loading="loading"
                    :disabled="loading"
                    dark
                >
                    Xin Vào
                </v-btn>
                <v-btn
                    v-if="request"
                    statusUpdate="1"
                    rounded
                    color="#424242"
                    dark
                >
                    Chờ xét duyệt
                </v-btn>
            </div>
        </div>
        <v-snackbar
            :color="color"
            v-model="snackbar"
            :timeout="10000"
            :top="true"
        >
            {{ text }}
        </v-snackbar>
    </div>
</template>
<script>
import user from "../../mixin/user";
export default {
    props: ["group", "isLoading"],
    mixins: [user],
    data() {
        return {
            statusRequest: null,
            loading: false,
            snackbar: false,
            text: "",
            color: "error",
        };
    },
    updated() {},
    created() {
        this.setStatus;
    },
    computed: {
        setStatus() {
            if (this.request) {
                this.statusRequest = this.request.status;
            }
        },

        isMember() {
            const exist = this.group.members.find((user) => {
                return user.users_id == this.id;
            });
            if (exist) {
                return true;
            }
            return false;
        },
        isAdmin() {
            if (this.group.founder.id == this.id) {
                return true;
            }
            return false;
        },
        inGroup() {
            if (this.isMember || this.isAdmin) {
                return true;
            }
            return false;
        },
        request() {
            if (this.group.requests_join.length > 0) {
                const Rq = this.group.requests_join.find((rq) => {
                    return rq.users_id == this.id;
                });
                if (Rq) {
                    return Rq;
                }
            }
            return false;
        },
    },
    methods: {
        async sendRequest() {
            this.loading = true;
            await this.$store
                .dispatch("users/rqJoinGr", {
                    groupId: this.group.id,
                })
                .then((req) => {
                    this.loading = false;
                    this.snackbar = true;
                    this.text = "Gửi yêu cầu tham gia nhóm thành công";
                    this.color = "success";
                    this.statusRequest = 1;
                })
                .catch((err) => {
                    this.loading = false;
                    this.snackbar = true;
                    this.text = "Gửi yêu cầu tham gia nhóm thất bại";
                    this.color = "error";
                    this.statusRequest = null;
                });
        },
    },
};
</script>
<style scoped>
.userActive {
    color: #fff;
    background-color: #007bff;
}
.max-w-100 {
    max-width: 100% !important;
}
.card-group {
    padding: 0 !important;
    padding-right: 10px !important;
}
.small {
    font-size: 14px;
    color: #fff !important;
}
.group-image {
    border-radius: 8px;
}
a {
    text-decoration: none !important;
}
.group-name {
    font-size: 18px;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 5px;
}
</style>
