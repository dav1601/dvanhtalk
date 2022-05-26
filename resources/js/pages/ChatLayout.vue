<template>
    <div
        :class="[
            !isGroup
                ? [
                      'col-12',
                      'col-lg-7',
                      'col-xl-9',
                      'position-relative',
                      'row',
                      'g-0',
                  ]
                : ['col-12', 'row', 'g-0'],
        ]"
    >
        <!-- <v-dialog :fullscreen="true" v-model="dialog" :dark="true">
            <the-setting
                :receiver="receiver"
                :isAdmin="isAdmin"
                :isMod="isMod"
                :isManage="isManage"
            ></the-setting>
        </v-dialog> -->
        <div
            class="col-3 border-right listUser scroll-custom"
            v-if="isGroup && !checking"
        >
            <item-member
                v-for="(user, key) in receiver.members"
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
            class="position-relative"
            :class="[!isGroup ? ['col-12'] : ['col-9']]"
            v-if="!checking"
        >
            <v-snackbar v-model="notification" :timeout="timeout">
                {{ text }}
            </v-snackbar>
            <base-loading :isLoading="isLoading"></base-loading>
            <div class="px-4 border-bottom d-none d-lg-block">
                <div class="d-flex align-items-center py-1">
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
                            @click="uploadFile"
                            color="blue-grey"
                            class="ma-2 white--text"
                            fab
                        >
                            <v-icon dark>mdi-file</v-icon>
                        </v-btn>
                        <v-btn
                            :loading="setting"
                            :disabled="setting"
                            @click="upload"
                            color="blue-grey"
                            class="ma-2 white--text"
                            fab
                        >
                            <v-icon dark>mdi-image</v-icon>
                        </v-btn>
                        <input
                            type="file"
                            accept="image/*"
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
                        <v-btn
                            :loading="setting"
                            :disabled="setting"
                            color="blue-grey"
                            class="ma-2 white--text"
                            fab
                        >
                            <v-icon dark @click="dialog = true">mdi-cog</v-icon>
                        </v-btn>
                    </div>
                </div>
            </div>

            <div class="position-relative">
                <div
                    class="chat-messages p-4 scroll-custom"
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
                        @loaded="loaded"
                    ></item-msg>
                    <item-tying
                        :receiver="receiver"
                        :typing="typing"
                        v-if="!isGroup"
                    ></item-tying>
                </div>
            </div>
            <div class="flex-grow-0 py-3 px-4 border-top">
                <div class="input-group">
                    <v-textarea
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
            image: "",
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
            forcusScroll: false,
            dialog: false,
            setting: false,
        };
    },

    created() {
        this.setup;
        this.setReceiver;
        this.getMessages;
    },
    mounted() {
        if (this.type == 0) {
            Echo.leave(`group-chat-${this.friendId}`);
            Echo.leave(`chat-${this.friendId}`);
            this.server(this.friendId);
            this.updateSeen(this.friendId);
        } else {
            Echo.leave(`chat-${this.friendId}`);
            Echo.leave(`group-chat-${this.friendId}`);
            this.serverGroup(this.friendId);
        }
    },
    computed: {
        setup() {
            this.disableChat = true;
            this.setting = true;
            this.setType;
        },
        endSetup() {
            console.log("end setup");
            this.disableChat = false;
            this.setting = false;
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

        setType() {
            if (this.isGroup) {
                return (this.type = 1);
            }
            return (this.type = 0);
        },
        usersMyRoom() {
            return this.$store.getters["users/usersMyRoom"];
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
        placeHolder() {
            return this.sending ? "Đang gửi tin nhắn...." : "Nhắn 1 cái gì đó";
        },
        receiver() {
            return this.$store.getters["message/receiver"];
        },
        messages() {
            return this.$store.getters["message/messages"];
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
                    this.dialog = true;
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
        async getMessages() {
            if (this.endPage == null || this.endPage == 0) {
                this.isLoading = true;
                let initialHeight = 0;
                if (this.page > 1) {
                    initialHeight = this.$refs.layoutChat.scrollHeight;
                }
                await this.$store
                    .dispatch("message/getMessages", {
                        to: this.friendId,
                        type: this.type,
                        page: this.page,
                    })
                    .then((req) => {
                        this.page = req.data.page;
                        this.endPage = req.data.endPage;
                        this.isLoading = false;
                        this.endSetup;
                        this.$nextTick(() => {
                            console.log("his: " + initialHeight);
                        });
                    })
                    .catch((err) => {
                        this.page = req.data.page;
                        this.endPage = req.data.endPage;
                        this.isLoading = false;
                        this.notification = true;
                        this.text =
                            "Load tin nhắn thất bại bạn vui lòng nhấn F5 để thử lại hoặc Refresh lại trang ";
                    });
            } else {
                return;
            }
        },
    },
    methods: {
        resetLoad() {
            this.message = "";
            this.image = "";
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
            this.typing = false;
        },
        handleScroll(e) {
            const scrollTop = e.target.scrollTop;
            const height = this.$refs.layoutChat.clientHeight;
            const scroll = this.$refs.layoutChat.scrollHeight;
            const sum = scrollTop + height;
            if (sum < scroll) {
                this.blockSroll = true;
            } else if (sum == scroll) {
                this.blockSroll = false;
            }
            if (scrollTop == 0) {
                if (this.endPage != 1) {
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
            return this.scrollEnd();
        },
        scrollEnd(foc = false, saveScrollHeight = 0) {
            console.log("after history: " + saveScrollHeight);
            const el = document.getElementById("chatLayout");
            if (el) {
                let scroll = el.scrollHeight;
                console.log("sum: " + Number(scroll - saveScrollHeight));
                if (!this.blockSroll || foc) {
                    return el.scrollTo({
                        top: Number(scroll - saveScrollHeight),
                        behavior: "smooth",
                    });
                }
            }
        },
        resetAll() {
            this.sending = false;
            this.disableChat = false;
            this.message = "";
            this.image = "";
        },
        upload() {
            this.$refs.messageImage.click();
        },
        uploadFile() {
            this.$refs.messageAudio.click();
        },
        changeAudioToSendMessage(e) {
            this.audio = e.target.files[0];
            this.sendMessage(3);
        },
        changeToSendMessage(e) {
            this.image = e.target.files[0];
            this.sendMessage(2);
        },
        sendMessage(type) {
            let seen = 0;
            if (this.inRoom) {
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
                        this.scrollEnd(true);
                    })
                    .catch((err) => {
                        this.resetAll();
                        this.scrollEnd(true);
                    });
            }
        },
    },
    watch: {
        async friendId(newVal, oldVal) {
            await this.$store.dispatch("message/reset");
            this.resetLoad();
            this.disableChat = true;
            this.setting = true;
            this.checking = false;
            this.$nextTick();
            this.setType;
            this.setReceiver;
            this.getMessages;
            if (this.type == 0) {
                await Echo.leave(`group-chat-${oldVal}`);
                await Echo.leave(`chat-${oldVal}`);
                await this.server(newVal);
                await this.updateSeen(newVal);
            } else {
                await Echo.leave(`chat-${oldVal}`);
                await Echo.leave(`group-chat-${oldVal}`);
                await this.serverGroup(newVal);
            }
            this.scrollEnd(true);
            this.setting = false;
            this.disableChat = false;
        },
    },
};
</script>
<style lang="scss">
.ske-layout-left-chat {
    .v-skeleton-loader__image {
        height: 100vh !important;
    }
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
