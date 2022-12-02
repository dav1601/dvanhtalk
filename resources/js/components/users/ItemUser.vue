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
        :id="active ? 'currentUserChat' : ''"
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
                    :showStt="true"
                    :userId="user.id"
                ></item-avatar>
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
export default {
    props: ["user", "active", "isLoading", "link"],
    data() {
        return {
            count: this.user.count.length,
        };
    },
    computed: {
        me() {
            return this.user.lastest_msg.sd_id == this.authId;
        },
        lastestMessage() {
            if (this.user.lastest_msg == null) {
                return "";
            }
            let prefix = "Đã gửi";
            if (this.me) {
                prefix = "Bạn đã gửi";
            }
            switch (this.user.lastest_msg.type_msg) {
                case 2:
                    return (
                        prefix +
                        " " +
                        this.user.lastest_msg.message.message.split(",")
                            .length +
                        " " +
                        "ảnh"
                    );
                case 3:
                    return prefix + " tệp âm thanh";
                case 7:
                    return prefix + " tệp video";
                default:
                    prefix = "";
                    if (this.me) {
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
        // this.resetSeen();
    },
    methods: {
        // findPos(obj) {
        //     var curtop = 0;
        //     if (obj.offsetParent) {
        //         do {
        //             curtop += obj.offsetTop;
        //         } while ((obj = obj.offsetParent));
        //         return [curtop];
        //     }
        // },
        // scrollElement() {
        //     const el = document.getElementsByClassName("router-link-active")[0];
        //       console.log(this.findPos(el));
        //     return document
        //         .getElementsByClassName("listUser")[0]
        //         .scroll(0, this.findPos(el) - 120);
        // },
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
