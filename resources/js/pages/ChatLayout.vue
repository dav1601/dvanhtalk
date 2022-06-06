<template>
    <div
        class="wrapper__layout--chat pl-0 py-0 h-100"
        :class="[
            !isGroup
                ? [
                      'col-12',
                      'col-lg-7',
                      'col-xl-9',
                      'position-relative',
                      'row',
                      'g-0',
                      'mx-0',
                  ]
                : ['col-12', 'row', 'mx-0', 'g-0'],
        ]"
    >
        <v-dialog
            :fullscreen="true"
            content-class="dialog__setting--group"
            v-model="dialog"
            :dark="true"
            style="z-index: 90000"
        >
            <the-setting
                :receiver="receiver"
                :isAdmin="isAdmin"
                :isMod="isMod"
                :isManage="isManage"
                :members="members"
                @close-dialog="closeDialog"
            ></the-setting>
        </v-dialog>
        <div
            class="col-3 border-right davList scroll-custom"
            v-if="isGroup && !checking"
        >
            <item-member
                v-for="(user, key) in members"
                :key="'member' + key"
                :member="user"
                :isChecking="checking"
                :isAdmin="isAdmin"
                :isMod="isMod"
                :isManage="isManage"
                :isSetting="false"
            ></item-member>
            <hr class="d-block d-lg-none mt-1 mb-0" />
        </div>
        <div
            class="col-3 listUser scroll-custom"
            v-if="isGroup && checking"
            style="height: 100vh !important; overflow: unset"
        >
            <v-skeleton-loader
                type="image"
                class="ske-layout-left-chat"
                width="100%"
            >
            </v-skeleton-loader>
        </div>
        <!--  -->
        <div
            class="position-relative d-flex flex-column justify-between px-0 py-0 h-100 chat__layout"
            :class="[!isGroup ? ['col-12'] : ['col-9']]"
            v-if="!checking"
        >
            <v-snackbar v-model="notification" :timeout="timeout">
                {{ text }}
            </v-snackbar>
            <base-loading :isLoading="isLoading"></base-loading>
            <div
                class="px-4 py-4 border-bottom d-none d-lg-block chat__layout--header"
            >
                <div class="d-flex align-items-center">
                    <div class="position-relative">
                        <img
                            :src="makeAvatar(receiver.avatar)"
                            class="rounded-circle mr-1"
                            :alt="$store.getters['message/receiver'].name"
                            width="45"
                            height="45"
                        />
                    </div>
                    <div class="flex-grow-1 pl-3">
                        <strong>{{ receiver.name }}</strong>
                    </div>
                    <div>
                        <v-btn
                            :loading="setting"
                            :disabled="setting"
                            v-if="isManage"
                            color="primary"
                            class="ma-2 white--text"
                            fab
                            small
                            @click.stop="dialog = true"
                        >
                            <v-icon dark>mdi-cog</v-icon>
                        </v-btn>
                    </div>
                </div>
            </div>

            <div class="position-relative wrapperChatLayout">
                <div
                    class="position-absolute w-100 btn__chat--end d-flex justify-center align-items-center"
                >
                    <v-btn
                        :loading="setting"
                        :disabled="setting"
                        color="blue-grey"
                        class="ma-2 white--text"
                        fab
                        small
                        v-if="btnGoEndChat"
                        style="z-index: 200"
                        @click="handleClickToBot()"
                    >
                        <v-icon dark color="primary"
                            >mdi-arrow-down-thin</v-icon
                        >
                    </v-btn>
                </div>
                <div
                    class="chat-messages p-4 scroll-custom chat__layout--body"
                    id="chatLayout"
                    ref="layoutChat"
                    @scroll="handleScroll"
                >
                    <item-msg
                        v-for="(message, key) in messages"
                        :key="key"
                        :data="message"
                        :receiver="receiver"
                        :typeUserMsg="type"
                        @loaded="loaded()"
                    ></item-msg>
                    <item-tying
                        :receiver="receiver"
                        :typing="typing"
                        v-if="!isGroup"
                    ></item-tying>
                </div>
            </div>
            <div
                class="flex-grow-0 flex-1 d-flex position-relative chat__layout--footer"
            >
                <v-btn
                    :loading="setting"
                    :disabled="setting"
                    color="primary"
                    class="ma-2 white--text positon-ralative"
                    fab
                    small
                    @click.stop="toggleFormatMessage()"
                    style="z-index: 100000"
                >
                    <v-scroll-y-transition>
                        <div
                            class="group__message position-absolute"
                            ref="group__message"
                            v-show="showFormatMessage"
                            v-click-outside="closeEvent"
                        >
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                class="d-none"
                                ref="messageImage"
                                @change="changeToSendMessage"
                                :data-image="image"
                            />
                            <input
                                type="file"
                                accept="audio/*"
                                class="d-none"
                                ref="messageAudio"
                                @change="changeAudioToSendMessage"
                            />
                            <div
                                class="position-relative w-100 h-100 center-start flex-column"
                            >
                                <div
                                    class="group__message--format --image center-start"
                                    @click.stop="uploadFileImage"
                                >
                                    <v-icon
                                        color="primary"
                                        style="font-size: 30px"
                                        class="cursor-pointer"
                                        dark
                                        >mdi-image</v-icon
                                    >
                                    <span class="gmf__name">Gửi file ảnh</span>
                                </div>
                                <div
                                    class="group__message--format --image center-start"
                                    @click.stop="uploadFileAudio"
                                >
                                    <v-icon
                                        color="primary"
                                        style="font-size: 30px"
                                        class="cursor-pointer"
                                        dark
                                        >mdi-music</v-icon
                                    >
                                    <span class="gmf__name"
                                        >Gửi file audio</span
                                    >
                                </div>

                                <div class="arrow-down position-absolute"></div>
                            </div>
                        </div>
                    </v-scroll-y-transition>
                    <v-icon dark>mdi-plus</v-icon>
                </v-btn>

                <div style="flex: 1" class="dav__wp-chat--input">
                    <div class="preview__images--wp w-100 p-3">
                        <div
                            class="d-flex justify-content-start align-items-center flex-wrap w-100"
                        >
                            <div class="img__item">
                                <img
                                    width="100%"
                                    height="100%"
                                    src="https://res.cloudinary.com/vanh-tech/image/upload/v1652075156/rs.jpg"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    <v-textarea
                        id="input__message"
                        filled
                        auto-grow
                        :placeholder="placeHolder"
                        rows="2"
                        row-height="20"
                        @keydown.enter.prevent="sendMessage(1)"
                        v-model.trim="message"
                        :disabled="disableChat"
                        @keyup="isTyping"
                        :loading="sending"
                    ></v-textarea>
                </div>
            </div>
        </div>
        <!--  -->
        <div
            class="position-relative"
            :class="[!isGroup ? ['col-12'] : ['col-9']]"
            v-else
        >
            <v-skeleton-loader
                type="image"
                class="ske-layout-left-chat"
                width="100%"
            >
            </v-skeleton-loader>
        </div>
        <!--  -->
    </div>
</template>
<script>
import ItemMsg from "../components/chat/ItemMsg.vue";
import user from "../mixin/user";
import chat from "../mixin/servers/chat";
import ItemUser from "../components/users/ItemUser.vue";
import ItemMember from "../components/users/ItemMember.vue";
import ItemTying from "../components/chat/ItemTying.vue";
import TheSetting from "../components/users/group/TheSetting.vue";
export default {
    components: { ItemMsg, ItemUser, ItemMember, ItemTying, TheSetting },
    mixins: [user, chat],
    props: ["friendId"],
    data() {
        return {
            message: "",
            images: [],
            parent_id: null,
            isLoading: false,
            seen: false,
            sending: false,
            disableChat: false,
            audio: "",
            timeout: 4000,
            notification: false,
            text: "",
            type: 0,
            checking: false,
            page: 1,
            endPage: null,
            blockSroll: false,
            btnGoEndChat: false,
            forcusScroll: false,
            dialog: false,
            setting: false,
            showFormatMessage: false,
            arrayImages: [],
            arrayFileAudio: [],
        };
    },
    beforeCreate() {
        localStorage.setItem("saveScrollHeight", 0);
    },
    async created() {
        this.$store.dispatch("message/reset");
        this.setup();
        this.setType();
        this.setReceiver();
        if (this.type == 0) {
            await this.updateSeen(this.friendId);
            Echo.leave(`group-chat-${this.friendId}`);
            Echo.leave(`chat-${this.friendId}`);
            this.server(this.friendId);
        } else {
            Echo.leave(`chat-${this.friendId}`);
            Echo.leave(`group-chat-${this.friendId}`);
            this.serverGroup(this.friendId);
        }
    },
    async mounted() {
        this.setHeightChatLayoutBody(false, true);
        this.getMessages(false);
    },
    computed: {
        members() {
            if (this.receiver.members) {
                return this.receiver.members.sort(this.compareRoleMember);
            }
        },
        typing() {
            return this.$store.getters["message/isTyping"];
        },
        isGroup() {
            return this.$route.name == "group";
        },
        isAdmin() {
            return this.id == this.receiver.users_id;
        },
        isMod() {
            if (this.receiver.members) {
                const user = this.receiver.members.find(
                    (user) => user.users_id == this.id
                );
                if (user) {
                    if (user.role == 1) {
                        return true;
                    }
                }
            }
            return false;
        },
        isManage() {
            if (this.isAdmin || this.isMod) {
                return true;
            }
            return false;
        },
        usersMyRoom() {
            return this.$store.getters["users/usersMyRoom"];
        },
        placeHolder() {
            return this.sending ? "Đang gửi tin nhắn...." : "Nhắn 1 cái gì đó";
        },
        receiver() {
            return this.$store.getters["message/receiver"];
        },
        messages() {
            return this.$store.getters["message/messages"];
        },
    },
    methods: {
        handleClickToBot() {
            localStorage.setItem("saveScrollHeight", 0);
            return this.scrollEnd(true);
        },
        setHeightChatLayoutBody(watch = false, start = false) {
            let elMain = document.getElementsByClassName("chat__layout")[0];
            let elBody =
                document.getElementsByClassName("chat__layout--body")[0];
            let el1 = document.getElementsByClassName(
                "chat__layout--header"
            )[0];
            let el2 = document.getElementsByClassName(
                "chat__layout--footer"
            )[0];
            let hEl1 = parseInt(
                el1.offsetHeight -
                    (parseInt(window.getComputedStyle(el1).paddingTop) +
                        parseInt(window.getComputedStyle(el1).paddingBottom))
            );
            let hEl2 = parseInt(
                el2.offsetHeight -
                    (parseInt(window.getComputedStyle(el2).paddingTop) +
                        parseInt(window.getComputedStyle(el2).paddingBottom))
            );
            if (watch && !start) {
                hEl1 += 11;
                hEl2 += 10;
            }
            let sum =
                parseInt(elMain.clientHeight - parseInt(hEl1 + hEl2)) + "px";
            elBody.style.height = sum;
        },
        toggleFormatMessage() {
            return (this.showFormatMessage = !this.showFormatMessage);
        },
        closeDialog(close) {
            console.log(close);
            this.dialog = false;
        },
        setType() {
            if (this.isGroup) {
                return (this.type = 1);
            }
            return (this.type = 0);
        },
        inRoom() {
            let user = this.usersMyRoom.find(
                (user) => user.id == this.friendId
            );
            if (user) {
                return true;
            }
            return false;
        },
        setup() {
            this.disableChat = true;
            this.setting = true;
        },
        endSetup() {
            this.disableChat = false;
            this.setting = false;
        },
        async setReceiver() {
            if (this.type == 1) {
                this.checking = true;
            }
            await this.$store
                .dispatch("message/getReceiver", {
                    contactId: this.friendId,
                    type: this.type,
                })
                .then((req) => {
                    if (this.type == 1) {
                        if (
                            !this.receiver.members.find(
                                (user) => user.users_id == this.id
                            )
                        ) {
                            this.checking = false;
                            return this.$router.push({ name: "home" });
                        }
                        this.checking = false;
                    }
                })
                .catch((err) => {
                    return this.$router.push({ name: "home" });
                });
        },

        async getMessages(up = false) {
            if (this.endPage == null || this.endPage == 0) {
                this.isLoading = true;
                const elLayoutChat = document.getElementById("chatLayout");
                let initialHeight = 0;
                if (up) {
                    initialHeight = Number(elLayoutChat.scrollHeight);
                    localStorage.setItem("saveScrollHeight", initialHeight);
                }
                await this.$store
                    .dispatch("message/getMessages", {
                        to: this.friendId,
                        type: this.type,
                        page: this.page,
                    })
                    .then((req) => {
                        this.endPage = req.data.endPage;
                        this.isLoading = false;
                        this.$nextTick(() => {
                            this.scrollEnd(!this.blockSroll);
                            this.endSetup();
                        });
                    })
                    .catch((err) => {
                        this.endPage = req.data.endPage;
                        this.isLoading = false;
                        this.notification = true;
                        this.text =
                            "Load tin nhắn thất bại bạn vui lòng nhấn F5 để thử lại hoặc Refresh lại trang ";
                        this.$nextTick(() => {
                            this.scrollEnd(!this.blockSroll);
                            this.endSetup();
                        });
                    });
            } else {
                return;
            }
        },

        handleScroll(e) {
            const elLayoutChat = document.getElementById("chatLayout");
            const scrollTop = elLayoutChat.scrollTop;
            if (this.isPointBlockScroll()) {
                this.blockSroll = true;
                this.btnGoEndChat = true;
            } else {
                this.blockSroll = false;
                this.btnGoEndChat = false;
            }
            if (scrollTop == 0) {
                if (this.endPage != 1 && this.endPage != null) {
                    this.blockSroll = false;
                    this.page++;
                }
            }
        },
        isTyping() {
            if (this.type == 0) {
                let typing = false;
                if (this.message != "") {
                    typing = true;
                }
                Echo.private(`chat-${this.receiver.id}`).whisper("typing", {
                    sender: this.id,
                    typing: typing,
                });
            } else {
                return;
            }
        },
        loaded() {
            this.scrollEnd(true);
        },

        resetAll() {
            this.sending = false;
            this.disableChat = false;
            this.message = "";
            this.image = "";
        },
        uploadFileImage() {
            this.$refs.messageImage.click();
        },
        uploadFileAudio() {
            this.$refs.messageAudio.click();
        },
        changeAudioToSendMessage(e) {
            this.audio = e.target.files[0];
            this.sendMessage(3);
        },
        changeToSendMessage(e) {
            // this.images = e.target.files[0];
            // this.sendMessage(2);
        },
        sendMessage(type) {
            let seen = 0;
            if (this.inRoom()) {
                seen = 1;
            }
            if (this.message == "" && this.image == "" && this.audio == "") {
                this.resetAll();
            } else {
                this.sending = true;
                this.disableChat = true;
                this.$store
                    .dispatch("message/sendMessage", {
                        to: this.friendId,
                        from: this.id,
                        msg: this.message,
                        parent_id: this.parent_id,
                        seen: seen,
                        // this type for text,file,audio message
                        type: type,
                        file: this.image,
                        audio: this.audio,
                        // that type for 1: pers 2: group
                        for: this.type,
                    })
                    .then((req) => {
                        this.resetAll();
                        this.scrollEnd(true, true);
                    })
                    .catch((err) => {
                        this.resetAll();
                        this.scrollEnd(true);
                    });
            }
        },
        closeEvent() {
            this.showFormatMessage = false;
        },
        resetLoad() {
            this.message = "";
            this.images = [];
            this.parent_id = null;
            this.isLoading = false;
            this.seen = false;
            this.sending = false;
            this.disableChat = false;
            this.audio = "";
            this.timeout = 4000;
            this.notification = false;
            this.text = "";
            this.type = 0;
            this.checking = false;
            this.page = 1;
            this.endPage = null;
            this.blockSroll = false;
            this.btnGoEndChat = false;
            this.isLoadingGroup = false;
            this.isLoadingUsers = false;
        },
    },
    watch: {
        async friendId(newVal, oldVal) {
            localStorage.setItem("saveScrollHeight", 0);
            this.$store.dispatch("message/reset");
            this.resetLoad();
            this.setting = true;
            this.disableChat = true;
            this.checking = false;
            this.setType();
            this.setReceiver();
            if (this.type == 0) {
                await Echo.leave(`group-chat-${oldVal}`);
                await Echo.leave(`chat-${oldVal}`);
                this.server(newVal);
                this.updateSeen(newVal);
            } else {
                await Echo.leave(`chat-${oldVal}`);
                await Echo.leave(`group-chat-${oldVal}`);
                this.serverGroup(newVal);
            }
            this.getMessages(false);
        },
        page(newVal) {
            if (newVal > 1) {
                this.getMessages(true);
            }
        },
        message(newVal) {
            this.setHeightChatLayoutBody(true);
        },
        images: {
            handler: function (val, oldVal) {
                console.log(val);
            },
            deep: true,
        },
    },
};
</script>
<style lang="scss">
#chatLayout {
    height: 100%;
}

.group__message {
    z-index: 20;
    &--format {
        margin-top: 5px;
        margin-bottom: 5px;
        padding: 5px;
        border-radius: 5px;
        width: 100%;
        margin-left: 2px;
        margin-right: 2px;
        cursor: pointer;
        &:hover {
            background: #999;
        }
        .gmf__name {
            font-size: 0.9375rem;
            font-weight: 600;
            line-height: 1.3333;
            color: #e4e6eb;
            font-size: 14px;
            margin-left: 5px;
            text-transform: capitalize;
        }
    }
}
.chat__layout {
    &--footer {
        flex: 1;
    }
}
.arrow-down {
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #121212;
    bottom: -6px;
    left: 6px;
}
.dav__wp-chat--input {
    .preview__images {
        background: hsla(0, 0%, 100%, 0.08);
        border-radius: 4px 4px 0 0 !important;
        .img__item {
            flex: 0 0 48px;
            max-width:48px;
        }
    }
}

.group__message {
    bottom: 45px;
    left: 15px;
    background: #121212;
    border-radius: 5px;
    
}
.ske-layout-left-chat {
    .v-skeleton-loader__image {
        height: 100vh !important;
    }
}
.btn__chat--end {
    bottom: 0;
    left: 0;
}
.v-main {
    padding: 64px 0 0 0 !important;
}
.va__setting--group {
    .v-toolbar__content {
        width: 100%;
        justify-content: space-between;
        i {
            cursor: pointer;
        }
    }
}

.card {
    background: #fff;
    transition: 0.5s;
    border: 0;
    margin-bottom: 30px;
    border-radius: 0.55rem;
    position: relative;
    width: 100%;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 10%);
}
.chat-app .people-list {
    width: 280px;
    position: absolute;
    left: 0;
    top: 0;
    padding: 20px;
    z-index: 7;
}

.chat-app .chat {
    margin-left: 280px;
    border-left: 1px solid #eaeaea;
}

.people-list {
    -moz-transition: 0.5s;
    -o-transition: 0.5s;
    -webkit-transition: 0.5s;
    transition: 0.5s;
}

.people-list .chat-list li {
    padding: 10px 15px;
    list-style: none;
    border-radius: 3px;
}

.people-list .chat-list li:hover {
    background: #efefef;
    cursor: pointer;
}

.people-list .chat-list li.active {
    background: #efefef;
}

.people-list .chat-list li .name {
    font-size: 15px;
}

.people-list .chat-list img {
    width: 45px;
    border-radius: 50%;
}

.people-list img {
    float: left;
    border-radius: 50%;
}

.people-list .about {
    float: left;
    padding-left: 8px;
}

.people-list .status {
    color: #999;
    font-size: 13px;
}

.chat .chat-header {
    padding: 15px 20px;
    border-bottom: 2px solid #f4f7f6;
}

.chat .chat-header img {
    float: left;
    border-radius: 40px;
    width: 40px;
}

.chat .chat-header .chat-about {
    float: left;
    padding-left: 10px;
}

.chat .chat-history {
    padding: 20px;
    border-bottom: 2px solid #fff;
}

.chat .chat-history ul {
    padding: 0;
}

.chat .chat-history ul li {
    list-style: none;
    margin-bottom: 30px;
}

.chat .chat-history ul li:last-child {
    margin-bottom: 0px;
}

.chat .chat-history .message-data {
    margin-bottom: 15px;
}

.chat .chat-history .message-data img {
    border-radius: 40px;
    width: 40px;
}

.chat .chat-history .message-data-time {
    color: #434651;
    padding-left: 6px;
}

.chat .chat-history .message {
    color: #444;
    padding: 18px 20px;
    line-height: 26px;
    font-size: 16px;
    border-radius: 7px;
    display: inline-block;
    position: relative;
}

.chat .chat-history .message:after {
    bottom: 100%;
    left: 7%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-bottom-color: #fff;
    border-width: 10px;
    margin-left: -10px;
}

.chat .chat-history .my-message {
    background: #efefef;
}

.chat .chat-history .my-message:after {
    bottom: 100%;
    left: 30px;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-bottom-color: #efefef;
    border-width: 10px;
    margin-left: -10px;
}

.chat .chat-history .other-message {
    background: #e8f1f3;
    text-align: right;
}

.chat .chat-history .other-message:after {
    border-bottom-color: #e8f1f3;
    left: 93%;
}

.chat .chat-message {
    padding: 20px;
}

.online,
.offline,
.me {
    margin-right: 2px;
    font-size: 8px;
    vertical-align: middle;
}

.online {
    color: #86c541;
}

.offline {
    color: #e47297;
}

.me {
    color: #1d8ecd;
}

.float-right {
    float: right;
}

.clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
}

@media only screen and (max-width: 767px) {
    .chat-app .people-list {
        height: 465px;
        width: 100%;
        overflow-x: auto;
        background: #fff;
        left: -400px;
        display: none;
    }
    .chat-app .people-list.open {
        left: 0;
    }
    .chat-app .chat {
        margin: 0;
    }
    .chat-app .chat .chat-header {
        border-radius: 0.55rem 0.55rem 0 0;
    }
    .chat-app .chat-history {
        height: 300px;
        overflow-x: auto;
    }
}

@media only screen and (min-width: 768px) and (max-width: 992px) {
    .chat-app .chat-list {
        height: 650px;
        overflow-x: auto;
    }
    .chat-app .chat-history {
        height: 600px;
        overflow-x: auto;
    }
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
    .chat-app .chat-list {
        height: 480px;
        overflow-x: auto;
    }
    .chat-app .chat-history {
        height: calc(100vh - 350px);
        overflow-x: auto;
    }
}
</style>
