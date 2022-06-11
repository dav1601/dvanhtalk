<template>
    <router-link
        v-if="!isLoading && link"
        class="list-group-item list-group-item-action border-0"
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
        <div class="d-flex align-items-start">
            <img
                :src="makeAvatar(user.avatar)"
                class="rounded-circle mr-1 img__obj--cover"
                alt="Vanessa Tucker"
                width="45"
                height="45"
            />
            <div class="flex-grow-1 ml-3" style="overflow: hidden">
                <span class="name text-overflow">{{ user.name }}</span>
                <div class="small center-start">
                    <span
                        class="fas fa-circle f-10"
                        :class="{
                            'chat-online': isOnline,
                            'chat-offline': !isOnline,
                        }"
                    ></span>
                    <span class="f-14 ml-2">{{ textStatus }}</span>
                </div>
            </div>
        </div>
    </router-link>
</template>
<script>
import user from "../../mixin/user";
export default {
    props: ["user", "isOnline", "active", "isLoading", "link"],
    mixins: [user],
    data() {
        return {
            count: this.user.count.length,
        };
    },
    computed: {
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
