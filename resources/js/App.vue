<template>
    <!-- App.vue -->

    <v-app
        :class="[
            !isSettingUser
                ? ['fix__layout']
                : ['overflow-y-scroll', 'scroll-custom'],
        ]"
    >
        <form
            id="logout-form"
            :action="route('logout.perform')"
            method="POST"
            style="display: none"
        >
            <input type="hidden" name="_token" :value="csrfToken" />
        </form>
        <audio loop class="d-none" ref="ringCallRcv">
            <source
                :src="$helpers.getAssetsPath('audio/facebook_call.mp3')"
                type="audio/mp3"
            />
        </audio>
        <audio class="d-none" ref="msgTone">
            <source
                :src="$helpers.getAssetsPath('audio/messenger_tone.mp3')"
                type="audio/mp3"
            />
        </audio>
        <v-dialog v-model="answerCallDialog" v-if="caller != null" width="300">
            <v-card dark class="p-2">
                <div
                    class="info__broadcaster d-flex flex-column justify-content-center align-center"
                >
                    <item-avatar
                        height="60px"
                        width="60px"
                        :fullWH="false"
                        :img="caller.avatar"
                        :username="caller.name"
                    ></item-avatar>
                    <v-card-title
                        >{{ caller.name }} đang gọi cho bạn</v-card-title
                    >
                    <v-card-text
                        >Cuộc gọi sẽ bắt đầu ngay lập tức nếu bạn đồng
                        ý</v-card-text
                    >
                </div>
                <div
                    class="action__call d-flex justify-content-center align-center my-2"
                >
                    <v-btn
                        class="mx-3"
                        fab
                        dark
                        small
                        color="pink"
                        @click="answerCall('deny')"
                    >
                        <v-icon dark> mdi-phone </v-icon>
                    </v-btn>
                    <v-btn
                        class="mx-3"
                        fab
                        dark
                        small
                        color="success"
                        @click="answerCall('accepted')"
                    >
                        <v-icon dark> mdi-phone </v-icon>
                    </v-btn>
                </div>
            </v-card>
        </v-dialog>
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
        <!-- <notifications
            group="effect__group"
            position="top right"
            :speed="1000"
            :duration="7000"
            class="effect__group mb-2"
        >
            <template slot="body" slot-scope="props">
                <join-chat :member="props.item.data.member"></join-chat>
            </template>
        </notifications> -->
        <v-app-bar
            app
            class="b-b"
            :class="{ 'd-ipp-none': !isHome || !isIpadProUp }"
            v-if="!isCallChat"
            id="main__app__bar"
        >
            <v-container
                class="d-flex justify-content-between align-items-center"
            >
                <!-- <app-bar-mobile v-if="!isHome"></app-bar-mobile> -->
                <router-link
                    :to="{ name: 'home' }"
                    style="width: 100px; height: 100px"
                >
                    <img
                        :src="$helpers.getAssetsPath('images/logo.png')"
                        alt="logo"
                        height="100%"
                        width="100%"
                    />
                </router-link>
                <v-menu
                    :class="[isHome ? '' : 'd-ipp-none']"
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-width="200"
                    offset-x
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="indigo" dark v-bind="attrs" v-on="on">
                            Hi! {{ authName }}
                        </v-btn>
                    </template>

                    <v-card>
                        <v-list>
                            <v-list-item>
                                <v-list-item-avatar>
                                    <item-avatar
                                        height="100%"
                                        width="100%"
                                        :img="avatar"
                                        :username="authName"
                                    ></item-avatar>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                    <v-list-item-title>{{
                                        authName
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
                                @click.prevent="logout()"
                            >
                                Đăng xuất
                            </v-btn>
                            <v-btn
                                text
                                :link="true"
                                :to="{ name: 'setting__user' }"
                                color="primary"
                            >
                                Cài Đặt
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-menu>
            </v-container>
        </v-app-bar>
        <div v-if="!isIpadProUp">
            <div id="header__mobile" v-if="isSettingUser || isCallChat">
                <a
                    @click="$router.go(-1)"
                    class="d-flex align-items-center justify-content-start text-decoration-none"
                    ><v-icon color="#f8f9fa" size="25"
                        >mdi-keyboard-backspace</v-icon
                    >
                    <span class="d-block ml-4">dav chat</span>
                </a>
            </div>
        </div>
        <!-- Sizes your content based upon application components -->
        <v-main :class="[!isSettingUser ? 'fix-v-main' : 'p-0']">
            <!-- Provides the application the proper gutter -->
            <v-container
                :class="[
                    !isHome ? 'full' : '',
                    !isIpadProUp ? ['m-0', 'w-100', 'max-w-100'] : '',
                ]"
                class="p-0 h-100"
            >
                <!-- <div class="card" :class="{ fix1: isHome }">
          <v-slide-x-transition mode="out-in">
            <router-view></router-view>
          </v-slide-x-transition>
        </div> -->
                <v-card
                    :class="{ fix1: isHome, 'd-flex': isCallChat }"
                    class="p-0 h-100 wrapper__layout position-relative"
                >
                    <router-view
                        :auth="authUser"
                        :myChannel="myChannel"
                        :singalCaller="singalCaller"
                    ></router-view>
                </v-card>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import ListUser from "./pages/TheLobby.vue";
import chat from "./mixin/servers/chat";
import ItemJoin from "./components/users/ItemJoin.vue";
import TheRole from "./components/role/TheRole.vue";
import ItemReq from "./components/users/ItemReq";
import JoinChat from "./components/users/group/effect/JoinChat";
import ItemAvatar from "./components/users/ItemAvatar";
import chatCall from "./mixin/servers/chatCall";
export default {
    components: {
        ListUser,
        ItemJoin,
        TheRole,
        ItemReq,
        JoinChat,
        ItemAvatar,
    },
    props: ["auth"],
    mixins: [chat, chatCall],
    name: "App",
    data: () => ({
        fav: true,
        loadedMe: false,
        csrfToken: document.head.querySelector('meta[name="csrf-token"]')
            .content,
        authUser: JSON.parse(
            document
                .querySelector("meta[name='auth_user']")
                .getAttribute("content")
        ),
        menu: false,
        answerCallDialog: false,
        timeOutCall: null,
        statusCall: null,
        urlJoin: null,
        caller: null,
        singalCaller: null,
        streamIdCall: null,
        ringCallRcv: null,
        myChannel: {},
        settingCall: {
            TIMEWAITANS: 240000,
        },
    }),

    async created() {
        await this.setMe();
    },
    mounted() {
        this.initMyChannel();
    },
    computed: {
        isNotFound() {
            return this.$route.name == "404";
        },
        isMedia() {
            return this.$route.name == "messengerMedia";
        },
        inCall() {
            return this.$store.getters["message/inCall"];
        },
    },
    methods: {
        async setMe() {
            await this.$store.dispatch("auth/getMe", this.authUser);
        },

        resetCall(calling = false) {
            clearTimeout(this.timeOutCall);
            this.answerCallDialog = false;
            this.timeOutCall = null;
            this.statusCall = null;
            this.urlJoin = null;
            this.caller = null;
        },
        answerCall(ans) {
            if (ans == "accepted") {
                this.goCallRoom(this.urlJoin);
                this.resetCall(true);
            } else {
                this.sendAns(ans);
            }
        },
        sendAns(ans) {
            axios
                .post(route("call.answer"), {
                    type: "answer",
                    answer: ans,
                    callerId: this.caller.id,
                })
                .then((req) => {
                    this.resetCall();
                });
        },
        ring(r = true) {
            const audio = this.$refs.ringCallRcv;
            if (r) {
                audio.currentTime = 0;
                audio.play();
            } else {
                audio.pause();
            }
        },
        initMyChannel() {
            this.myChannel["notify"] = Echo.join(`notify-${this.authId}`);
            this.myChannel["lobby"] = Echo.join(`lobby`);
            this.myChannel["notify"]
                .here((users) => {})
                .listen("SenRqJoinGr", (e) => {
                    this.$notify({
                        group: "request__group",
                        data: {
                            request: e.reqJG,
                            nofifyFor: "admin",
                            status: null,
                        },
                    });
                    this.$store.dispatch("users/getReq", e.reqJG);
                })
                .listen("HandleRequest", (e) => {
                    if (e.data.action == "joinGr") {
                        this.$notify({
                            group: "request__group",
                            data: {
                                request: e.data.request,
                                nofifyFor: "user",
                                status: e.data.status,
                            },
                        });
                        this.$store.dispatch(
                            "users/getDataHandleRequest",
                            e.data
                        );
                    }
                    if (e.data.group_action == "reqActions") {
                        this.$store.dispatch("users/getHandleActions", e.data, {
                            root: true,
                        });
                        if (e.data.action == "kick") {
                            if (e.data.users_id == this.authId) {
                                this.$router.push({ name: "home" });
                            }
                        }
                    }
                    if (e.data.group_action == "reqSaveData") {
                        this.$store.dispatch(
                            "users/getDataGroupSave",
                            e.data.newestGr
                        );
                    }
                })
                .listen("NotifyCall", async (e) => {
                    if (e.data.type == "offer") {
                        this.caller = e.data.broadcaster;
                        if (!this.inCall) {
                            this.answerCallDialog = true;
                            this.urlJoin = e.data.urlJoin;
                        } else {
                            await this.answerCall("haveCall");
                        }
                    }
                    if (e.data.type == "ended") {
                        this.ring(false);
                        this.resetCall();
                    }
                });
            // ///////////////////////
            this.myChannel["lobby"]
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
                .listen("HandleUser", (e) => {})
                .listen("LobbyEvent", (e) => {
                    if (e.event == "update.user") {
                        this.$store.dispatch("users/getUserUpdate", e.data);
                    }
                });
            this.myChannelChat();
        },
    },
    watch: {
        incomingCall(incomingCall) {
            if (incomingCall) {
                this.ring();
                this.answerCallDialog = true;
                this.timeOutCall = setTimeout(
                    () => (
                        this.setIcmc(false),
                        (this.statusCall = "no answer"),
                        this.answerCall("missed")
                    ),
                    this.settingCall.TIMEWAITANS
                );
            } else {
                clearTimeout(this.timeOutCall);
                this.ring(false);
                this.answerCallDialog = false;
            }
        },
        answerCallDialog(open) {
            if (!open) {
                this.setIcmc(false);
            } else {
                this.setIcmc(true);
            }
        },
    },
};
</script>
<style lang="scss">
html {
    overflow: hidden;
}
@import "../sass/_variables.scss";
@import "../sass/_responsive.scss";
$roles: 0, 1, 2;
@each $role in $roles {
    .royal-role-#{$role} {
        @include designRole($role);
        .name-sender {
            @include designNameRole($role);
        }
    }
}
.vgs__gallery {
    display: unset !important;
}
.fix-padding {
    padding: 100px 0 0 0 !important;
}
.v-main {
    padding: 0 !important;
}
.fix-v-main {
    padding: 0 !important;
    height: calc(100vh - 100px);
}
.dav-text-14-g {
    font-size: 14px !important;
    color: var(--bs-gray-500) !important;
}
.dav-text-15-g {
    font-size: 15px !important;
    color: var(--bs-gray-500) !important;
}
.dav-text-16-g {
    font-size: 16px !important;
    color: var(--bs-gray-500) !important;
}

.b-b-4-d {
    border-bottom: 4px solid var(--bs-gray-dark);
}
#header__mobile {
    z-index: 50000;
    padding: 10px 20px;
    a {
        font-size: 20px;
        font-weight: 600;
        text-transform: capitalize;
        color: var(--bs-gray-100);
    }
}
.max-w-100 {
    max-width: 100% !important;
}
.overflow-y-scroll {
    overflow-y: scroll !important;
}
:root {
    scrollbar-color: var(--bs-gray-dark) #3e4042 !important;
    scrollbar-width: auto !important;
    --secondary-text: #b0b3b8;
}
.fix__layout {
    overflow: hidden !important;
    height: 100vh !important;
}

.ske__avatar {
    &--settingUser {
        .v-skeleton-loader__avatar {
            width: 120px;
            height: 120px;
        }
    }
}
.ske__button {
    &--settingUser {
        .v-skeleton-loader__button {
            width: 120px;
        }
    }
    &--settingUserPen {
        .v-skeleton-loader__button {
            width: 24px;
            height: 24px;
        }
    }
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
.dav-px-15 {
    padding-left: 15px !important;
    padding-right: 15px !important;
}
.fl-1 {
    flex: 1 !important;
}
#app {
    height: 100vh;
}
html::-webkit-scrollbar {
    display: none;
}
.text-overflow {
    display: block !important;
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
.fl-center-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.cursor-pointer {
    cursor: pointer !important;
}
// .chat-item {
//     width: 100%;
// }

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

.request__group {
    bottom: 30px !important;
    right: 20px !important;
    width: 400px !important;
}
.v-toolbar__content {
    height: 100% !important;
}
header {
    height: 100px !important;
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
// .davList {
//     // height: 100vh;
//     // overflow: auto;
// }
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
@for $i from 1 through 10 {
    .col-#{$i * 10} {
        flex: 0 0 #{$i * 10%};
        max-width: #{$i * 10%};
    }
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
.effect__group {
    width: unset !important;
    right: 110px !important;
    overflow: unset !important;
}
</style>
