<template>
    <router-link
        v-if="!isLoading && link"
        class="list-group-item list-group-item-action border-0"
        :to="{
            name: 'chat',
            params: { friendId: user.id },
            query: { uid: user.id },
        }"
        :class="{ classUser, active: active }"
        @click.native="resetSeen()"
    >
        <div
            class="badge bg-success float-right"
            v-show="count != 0"
            :id="classQueue"
            :data-count="count"
        >
            {{ count }}
        </div>
        <div class="d-flex align-items-start">
            <img
                :src="makeAvatar(user.avatar)"
                class="rounded-circle mr-1"
                alt="Vanessa Tucker"
                width="45"
                height="45"
            />
            <div class="flex-grow-1 ml-3">
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
            count: 0,
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
    methods: {
        resetSeen() {
            this.count = 0;
            let el = document.getElementById("queue-" + this.user.id);
            let countQueue = 0;
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
</style>
