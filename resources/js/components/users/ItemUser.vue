<template>
    <router-link
        v-if="!isLoading && link"
        class="listUser__item border-0"
        @click.native="resetSeen()"
        :to="{
            name: 'chat',
            params: { friendId: user.id },
            query: { uid: user.id },
        }"
        :class="{ classUser, active: active }"
    >
        <div
            class="badge bg-success float-right"
            v-show="count != 0"
            :id="classQueue"
            :data-count="count"
            :ref="'user-' + user.id"
        >
            {{ count }}
        </div>
        <div class="d-flex align-items-center listUser__item--left">
            <div class="position-relative avatar">
                <item-avatar
                    height="56px"
                    width="56px"
                    :img="user.avatar"
                    :username="user.name"
                ></item-avatar>
                <span
                    class="fas fa-circle position-absolute status"
                    :class="{
                        'chat-online': isOnline,
                        'chat-offline': !isOnline,
                    }"
                ></span>
            </div>
            <div class="ml-3 listUser__item--right" style="overflow: hidden">
                <span class="name text-overflow">{{ user.name }}</span>
                <span
                    class="f-14 small center-start last__msg text-overflow"
                    :class="'last__msg--' + user.id"
                    >{{ lastestMessage }}</span
                >
            </div>
        </div>
    </router-link>
</template>
<script>
import user from "../../mixin/user";
import ItemAvatar from "../../components/users/ItemAvatar.vue";
export default {
    props: ["user", "isOnline", "active", "isLoading", "link"],
    components: { ItemAvatar },
    mixins: [user],
    data() {
        return {
            count: this.user.count.length,
        };
    },
    computed: {
        lastestMessage() {
            if (this.user.lastest_msg == null) {
                return "";
            }
            if (this.user.lastest_msg.type_msg == 2) {
                let prefix = "Đã gửi";
                if (this.user.lastest_msg.sd_id == this.id) {
                    prefix = "Bạn đã gửi";
                }
                return (
                    prefix +
                    " " +
                    this.user.lastest_msg.message.message.split(",").length +
                    " " +
                    "ảnh"
                );
            } else if (this.user.lastest_msg.type_msg == 3) {
                let prefix = "Đã gửi";
                if (this.user.lastest_msg.sd_id == this.id) {
                    prefix = "Bạn đã gửi";
                }
                return (
                    prefix +
                    " " +
                    this.user.lastest_msg.message.message.split(",").length +
                    " " +
                    "tệp âm thanh"
                );
            } else {
                let prefix = "";
                if (this.user.lastest_msg.sd_id == this.id) {
                    prefix = "Bạn: ";
                }
                return prefix + this.user.lastest_msg.message.message;
            }
        },
        encryptedId() {
            return this.$CryptoJS.AES.encrypt(
                String(this.user.id),
                "User"
            ).toString();
        },
        textStatus() {
            return this.isOnline ? "Online" : this.user.offline_at;
        },

        classUser() {
            return "user-" + this.user.id;
        },
        classQueue() {
            return "queue-" + this.user.id;
        },

        getMessagesUnseen() {
            return (this.count = this.user.count.length);
        },
    },
    mounted() {
        if (this.isChat) {
            this.scrollElement();
        }
    },
    methods: {
        findPos(obj) {
            var curtop = 0;
            if (obj.offsetParent) {
                do {
                    curtop += obj.offsetTop;
                } while ((obj = obj.offsetParent));
                return [curtop];
            }
        },
        scrollElement() {
            const el = document.getElementsByClassName("router-link-active")[0];
            return document
                .getElementsByClassName("listUser")[0]
                .scroll(0, this.findPos(el) - 120);
        },
        resetSeen() {
            this.count = 0;
            let el = document.getElementById("queue-" + this.user.id);
            el.setAttribute("data-count", 0);
            el.innerHTML = 0;
            el.style.display = "none";
        },
    },
};
</script>
<style scoped>
.userActive {
    color: #fff;
    background-color: #007bff;
}

.list-group-item {
    margin: 10px !important;
}
</style>
