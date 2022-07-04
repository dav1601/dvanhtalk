<template>
    <div
        class="border-right listUser davList scroll-custom overflow-x-hidden"
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
            <item-user
                v-for="(user, key) in listUser"
                :key="'Lobby-User-' + key"
                :user="user"
                :active="active(user.id)"
                :link="true"
                :isLoading="isLoadingUsers"
            ></item-user>

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
    mounted() {},
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
    },
};
</script>
<style lang="scss">
.listUser {
    &__item.active {
        background: rgba(69, 127, 202, 0.2); /* fallback for old browsers */
        background: -webkit-linear-gradient(
            to right,
            rgba(86, 145, 200, 0.2),
            rgba(69, 127, 202, 0.2)
        ); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(
            to right,
            rgba(86, 145, 200, 0.2),
            rgba(69, 127, 202, 0.2)
        ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

        &:hover {
            text-decoration: none;
        }
    }
    &__item {
        padding: 10px;
        display: block;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
        text-decoration: none;
        margin-bottom: 10px;
        &--left {
            .avatar {
                max-height: 56px;
                max-width: 56px;
            }
            span.status {
                bottom: 3px;
                right: 1px;
                font-size: 12px !important;
            }
        }
        &--right {
            flex: 1;
            span.last__msg {
                color: var(--secondary-text) !important;
                display: block;
            }
        }

        .name {
            display: block;
            color: #f5f5f5;
        }
        &:hover:not(.active) {
            text-decoration: none;
            background: #232526; /* fallback for old browsers */
            background: -webkit-linear-gradient(
                to right,
                #414345,
                #232526
            ); /* Chrome 10-25, Safari 5.1-6 */
            background: linear-gradient(
                to right,
                #414345,
                #232526
            ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        } /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
}
.ps__rail-x {
    display: none !important;
}
</style>
