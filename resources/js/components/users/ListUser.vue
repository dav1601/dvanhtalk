<template>
    <div
        class="fl-1 border-right listUser davList scroll-custom overflow-x-hidden"
        @mouseover="toggleScroll('over')"
        @mouseleave="toggleScroll('leave')"
        :class="[
            isHome
                ? ['position-relative', 'overflow-y-auto']
                : ['overflow-y-auto'],
        ]"
        v-if="!isGroup"
    >
        <div class="d-none d-md-block" v-if="!isGroup">
            <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                    <input
                        type="text"
                        class="form-control my-3"
                        v-on:keyup="debounceSearchUser"
                        placeholder="Tìm 1 ai đó..."
                    />
                </div>
            </div>
        </div>
        <div v-if="!isGroup" style="margin-bottom: 69px">
            <perfect-scrollbar>
                <item-user
                    v-for="(user, key) in listUser"
                    :key="'Lobby-User-' + key"
                    :user="user"
                    :active="active(user.id)"
                    :link="true"
                    :isOnline="isOnline(user.id)"
                    :isLoading="isLoadingUsers"
                ></item-user>
            </perfect-scrollbar>
            <sk-item-user
                v-for="i in 10"
                :key="'Ske-User-' + i"
                :isLoading="isLoadingUser"
            >
                ></sk-item-user
            >
        </div>
    </div>
</template>
<script>
import user from "../../mixin/user";
import SkItemUser from "../../components/skeleton/SkItemUser.vue";
import ItemUser from "../../components/users/ItemUser.vue";
export default {
    props: {
        isLoadingUser: {
            type: Boolean,
            default: false,
        },
    },
    components: { SkItemUser, ItemUser },
    mixins: [user],
    mounted() {
        
    },
    methods: {

        toggleScroll(type) {
            if (!this.isHome) {
                const el = document.getElementsByClassName("listUser")[0];
                if (type == "over") {
                    el.classList.remove("overflow-y-hidden");
                    el.classList.remove("border-right");
                    el.classList.add("overflow-y-auto");
                } else {
                    el.classList.remove("overflow-y-auto");
                    el.classList.add("border-right");
                    el.classList.add("overflow-y-hidden");
                }
            }
        },
        active(id) {
            return id == this.$route.query.uid;
        },
        isOnline(id) {
            return this.listUsersOnline.find((user) => user.id == id);
        },
    },
};
</script>
<style lang="scss">
.ps__rail-x {
    display: none !important;
}
</style>
