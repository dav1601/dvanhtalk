<template>
    <!-- App.vue -->
    <v-app>
        <notifications
            group="request__group"
            position="bottom right"
            :speed="1000"
            :duration="10000"
            class="request__group mb-2"
        >
            <template slot="body" slot-scope="props">
                <item-req
                    :request="props.item.data.request"
                    :nofifyFor="props.item.data.nofifyFor"
                    :status="props.item.data.status"
                ></item-req>
            </template>
        </notifications>
        <v-app-bar app class="b-b" v-if="!isMedia">
            <v-container class="d-flex justify-content-end">
                <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-width="200"
                    offset-x
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="indigo" dark v-bind="attrs" v-on="on">
                            Hi! {{ name }}
                        </v-btn>
                    </template>

                    <v-card>
                        <v-list>
                            <v-list-item>
                                <v-list-item-avatar>
                                    <img
                                        src="https://cdn.vuetifyjs.com/images/john.jpg"
                                        alt="John"
                                    />
                                </v-list-item-avatar>

                                <v-list-item-content>
                                    <v-list-item-title>{{
                                        name
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ email }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-action>
                                    <v-btn
                                        :class="fav ? 'red--text' : ''"
                                        icon
                                        @click="fav = !fav"
                                    >
                                        <v-icon>mdi-heart</v-icon>
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn text @click="menu = false"> Đóng </v-btn>
                            <v-btn
                                color="primary"
                                text
                                onclick="event.preventDefault();
                              document.getElementById('logout-form').submit();"
                            >
                                Đăng xuất
                            </v-btn>
                            <form
                                id="logout-form"
                                :action="route('logout.perform')"
                                method="POST"
                                style="display: none"
                            >
                                <input
                                    type="hidden"
                                    name="_token"
                                    :value="csrfToken"
                                />
                            </form>
                        </v-card-actions>
                    </v-card>
                </v-menu>
            </v-container>
        </v-app-bar>
        <!-- Sizes your content based upon application components -->
        <v-main>
            <!-- Provides the application the proper gutter -->
            <v-container :class="{ full: !isHome }" class="p-0 h-100">
                <!-- <div class="card" :class="{ fix1: isHome }">
          <v-slide-x-transition mode="out-in">
            <router-view></router-view>
          </v-slide-x-transition>
        </div> -->
                <v-card :class="{ fix1: isHome }" class="p-0 h-100">
                    <v-slide-x-transition mode="out-in">
                        <router-view></router-view>
                    </v-slide-x-transition>
                </v-card>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import user from "./mixin/user";
import ListUser from "./pages/TheLobby.vue";
import chat from "./mixin/servers/chat";
import ItemJoin from "./components/users/ItemJoin.vue";
import TheRole from "./components/role/TheRole.vue";
import ItemReq from "./components/users/ItemReq";
export default {
    components: { ListUser, ItemJoin, TheRole, ItemReq },
    mixins: [user, chat],
    name: "App",
    data: () => ({
        fav: true,
        csrfToken: document.head.querySelector('meta[name="csrf-token"]')
            .content,
        menu: false,
    }),

    created() {
        this.setMe();
    },
    computed: {
        isNotFound() {
            return this.$route.name == "404";
        },
        isMedia() {
            return this.$route.name == "messengerMedia";
        },
    },
    methods: {
        async setMe() {
            await this.$store
                .dispatch("auth/getMe")
                .then((req) => {
                    Echo.join(`lobby`)
                        .here((users) => {
                            this.$store.dispatch("users/getUsersOnline", users);
                        })
                        .joining((user) => {
                            this.$store.dispatch("users/pushUsersOnline", user);
                        })
                        .leaving((user) => {
                            this.$store.dispatch("users/deleteUser", user);
                        })
                        .listen("NewGroup", (e) => {
                            this.$store.dispatch("users/getGroup", e.group);
                        })
                        .listen("NewUser", (e) => {
                            this.$store.dispatch("users/getNewUser", e.user);
                        })
                        .listen("HandleUser", (e) => {});
                    this.myServer();
                })
                .catch((err) => {
                    return this.$router.push("/login");
                });
        },
    },
};
</script>
<style lang="scss">
@import "../sass/_variables.scss";
$roles: 0, 1, 2;
@each $role in $roles {
    .royal-role-#{$role} {
        @include designRole($role);
        .name-sender {
            @include designNameRole($role);
        }
    }
}
// .v-responsive__sizer {
//     padding-bottom: 100% !important;
// }
:root {
    scrollbar-color: var(--bs-gray-dark) #3e4042 !important;
    scrollbar-width: auto !important;
}
html {
    overflow: hidden;
    height: 100vh;
}
.img__obj {
    &--cover {
        object-fit: cover;
        object-position: 50% 50%;
    }
    &--fill {
        object-fit: fill;
        object-position: 50% 50%;
    }
    &--contain {
        object-fit: contain;
        object-position: 50% 50%;
    }
}
.fl-1 {
    flex: 1 !important;
}
#app {
    height: 100%;
}
html::-webkit-scrollbar {
    display: none;
}
.text-overflow {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.listUser.col-xl-3 {
    flex: 0 0 20% !important;
    max-width: 20% !important;
}
.wrapper__layout--chat.col-xl-9 {
    flex: 0 0 80% !important;
    max-width: 80% !important;
}
.cursor-pointer {
    cursor: pointer !important;
}
.chat-item {
    max-width: 55% !important;
}

.chat-item.haveLink {
    max-width: 300px !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-bottom: 0 !important;
    .name-sender,
    .text-chat {
        padding-left: 12px !important;
        padding-right: 12px !important;
    }
    .text-chat {
        margin-bottom: 5px !important;
    }
    .in4__website {
        display: block;
        text-decoration: none;
        z-index: 100;
        background: var(--bs-gray-900) !important;
        width: 300px !important;
        span {
            color: #fff;
            display: block;
            font-weight: 600;
        }
    }
}

.list-group-item {
    border-radius: 8px !important;
}
.v-main {
    padding: 0 !important;
    height: calc(100vh - 64px);
}
.request__group {
    bottom: 30px !important;
    right: 20px !important;
    width: 400px !important;
}
header {
    position: unset !important;
}
.fix1 {
    border: none;
    .border-right {
        border-right: none !important;
    }
    .row {
        justify-content: center;
    }
}
.full {
    max-width: 100% !important;
}
.br-0 {
    border-radius: 0 !important;
}
.f-14 {
    font-size: 14px;
}
.f-10 {
    font-size: 10px;
}
.center-start {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.me-chat {
    background: #ff7675;
    color: #fff;
}
.friend-chat {
    background: #a29bfe;
    color: #fff;
}
.davList {
    height: 100vh;
    overflow: auto;
}
.list-group-item.active {
    border-radius: 8px;
    background: #a29bfe !important;
    transition: background 0.25s;
}
.list-group-item:hover {
    border-radius: 8px;
    background: #a29bfe !important;
    transition: background 0.25s;
}
.list-group-item {
    background: $bg-user;
    color: #fff !important;
    margin-bottom: 15px;
}
.chat-online {
    color: #34ce57;
}

.chat-offline {
    color: #e4606d;
}

.chat-messages {
    display: flex;
    flex-direction: column;
    height: 590px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.chat-message-left,
.chat-message-right,
.chat-message-system {
    display: flex;
    flex-shrink: 0;
}

.chat-message-left {
    margin-right: auto;
}
.chat-message-system {
    justify-content: center;
    line-height: 1.2727;
    color: #8a8d91 !important;
    font-size: 0.6875rem;
}

.chat-message-right {
    flex-direction: row-reverse;
    margin-left: auto;
}
.py-3 {
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
}
.px-4 {
    padding-right: 1.5rem !important;
    padding-left: 1.5rem !important;
}
.flex-grow-0 {
    flex-grow: 0 !important;
}
.border-top {
    border-top: 1px solid $b-c !important;
}
.b-b {
    border-bottom: 1px solid $b-c !important;
}
.b-r {
    border-right: 1px solid $b-c !important;
}
.b-l {
    border-left: 1px solid $b-c !important;
}
.lazy-image {
    overflow: unset !important;
}
.scroll-custom::-webkit-scrollbar-track {
    // -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #3e4042;
    opacity: 0.3;
}

.scroll-custom::-webkit-scrollbar {
    width: 10px;
    background-color: #f5f5f5;
}

.scroll-custom::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: var(--bs-gray-dark);
}
</style>
