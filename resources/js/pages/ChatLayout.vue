<template>
    <div
        class="wrapper__layout--chat pl-0 py-0 h-100"
        ref="mainLayoutChat"
        :class="[
            !isGroup
                ? ['position-relative', 'row', 'g-0', 'mx-0']
                : ['col-100', 'row', 'mx-0', 'g-0'],
            isIpadProUp && !isGroup ? ['col-80'] : ['col-100'],
        ]"
    >
        <input
            type="file"
            multiple
            class="d-none"
            ref="messageImage"
            @change="changeToSendMessage"
        />
        <!-- <input
            type="file"
            accept="audio/*"
            class="d-none"
            ref="messageAudio"
            @change="changeAudioToSendMessage"
        />
        <input
            type="file"
            accept="video/*"
            class="d-none"
            ref="messageVideo"
            multiple
            @change="changeVideoToSendMessage"
        /> -->
        <!-- start dialog setting for group -->
        <v-dialog
            :fullscreen="true"
            content-class="dialog__setting--group"
            v-model="dialog"
            :dark="true"
            style="z-index: 90000"
            v-if="isGroup && !isLoading"
        >
            <the-setting
                :isAdmin="isAdmin"
                :isMod="isMod"
                :isManage="isManage"
                :members="members"
                @close-dialog="closeDialog"
                v-if="!isLoading"
            ></the-setting>
        </v-dialog>
        <v-dialog
            v-model="dialogReaction"
            id="dialog__reaction"
            scrollable
            max-width="500"
            v-if="!isLoading"
        >
            <v-card dark>
                <v-card-title class="text-h5 d-block text-center b-b">
                    Cảm xúc về tin nhắn
                </v-card-title>
                <div id="dialog__reaction--nav">
                    <div
                        class="d-flex flex-wrap justify-content-start align-items-center tab__reaction"
                    >
                        <div
                            class="tab__reaction--item --all"
                            :class="[tabReationActive == 'all' ? 'active' : '']"
                            @click="loadReaction('all')"
                        >
                            Tất Cả {{ amountReaction }}
                        </div>
                        <div
                            class="tab__reaction--item"
                            v-for="(item, index) in groupReaction"
                            :class="[tabReationActive == index ? 'active' : '']"
                            @click="loadReaction(index)"
                            :key="'tab-icon-' + index"
                        >
                            {{ index }} {{ item.length }}
                        </div>
                    </div>
                </div>
                <div id="dialog__reaction--content" class="scroll-custom">
                    <item-user-reaction
                        v-for="(reaction, index) in allReaction"
                        :key="'user-reaction-' + index"
                        :data="reaction"
                        :type="typeChat"
                    ></item-user-reaction>
                </div>
            </v-card>
        </v-dialog>
        <!-- end dialog setting for group -->
        <!-- start gllImage  -->

        <dav-gallery-slide-show
            :images="media"
            :index="startImage"
            @close="closeGllFile"
        ></dav-gallery-slide-show>

        <!-- end gllImage -->
        <div
            class="col-20 border-right davList scroll-custom"
            v-if="isGroup && isIpadProUp"
        >
            <div v-if="loadedRcv">
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
            </div>

            <sk-item-user
                v-for="i in 10"
                :key="'ske-' + i"
                :isLoading="!loadedRcv"
            ></sk-item-user>

            <hr class="d-block d-lg-none mt-1 mb-0" />
        </div>

        <div
            class="position-relative d-flex flex-column justify-between px-0 py-0 h-100 chat__layout"
            :class="[
                isGroup ? ['col-80'] : '',
                !isIpadProUp ? ['col-100'] : '',
                isChat && showChatInfo && isIpadProUp ? ['col-70'] : '',
                isChat && !showChatInfo && isIpadProUp ? ['col-100'] : '',
            ]"
        >
            <v-snackbar
                v-model="notification"
                :timeout="timeout"
                color="error"
                :top="true"
            >
                {{ text }}
            </v-snackbar>
            <base-loading :isLoading="isLoading"></base-loading>
            <div
                class="py-4 border-bottom chat__layout--header d-flex justify-content-between align-center"
                :class="[isIpadProUp ? ['px-4'] : ['px-1']]"
            >
                <chat-bar-mobile
                    :loaded="loadedRcv"
                    :typeChat="typeChat"
                    class="d-ipp-block"
                ></chat-bar-mobile>
                <div class="d-ipp-none">
                    <div class="d-flex align-items-center" v-if="loadedRcv">
                        <div class="position-relative">
                            <item-avatar
                                v-if="isChat && typeChat == 0"
                                height="45px"
                                width="45px"
                                :username="getRcv()"
                                :img="getRcv('avatar')"
                                :fullWH="false"
                                :showStt="true"
                                :userId="getRcv('id')"
                            ></item-avatar>
                        </div>
                        <div class="flex-grow-1 pl-3">
                            <strong>{{ getRcv("name") }}</strong>
                            <text-small :text="statusText"></text-small>
                        </div>
                    </div>
                </div>
                <div
                    class="--actions d-flex justify-content-end align-items-center"
                >
                    <v-btn
                        :loading="setting"
                        :disabled="setting"
                        v-if="isManage && isGroup"
                        color="primary"
                        class="white--text action__chat"
                        fab
                        small
                        @click.stop="dialog = true"
                    >
                        <v-icon dark>mdi-pencil</v-icon>
                    </v-btn>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                                color="primary"
                                class="white--text action__chat"
                                fab
                                size="30"
                                v-bind="attrs"
                                v-on="on"
                                @click.stop="dialogSettingCall = true"
                                dark
                                >mdi-cog</v-icon
                            >
                        </template>
                        <span>Cài đặt cuộc gọi</span>
                    </v-tooltip>
                    <setting-call
                        :dialogSettingCall="dialogSettingCall"
                        @setting-call="settingCall"
                    ></setting-call>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                                dark
                                v-bind="attrs"
                                v-on="on"
                                color="primary"
                                size="30"
                                class="cursor-pointer action__chat"
                                @click="offerCall(false)"
                                >mdi-phone</v-icon
                            >
                        </template>
                        <span>Bắt đầu gọi thoại</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                                v-bind="attrs"
                                v-on="on"
                                dark
                                color="primary"
                                size="30"
                                class="cursor-pointer action__chat"
                                @click="offerCall(true)"
                                >mdi-video</v-icon
                            >
                        </template>
                        <span>Bắt đầu gọi video</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                                v-bind="attrs"
                                v-on="on"
                                dark
                                color="primary"
                                size="30"
                                @click="showChatInfo = !showChatInfo"
                                class="cursor-pointer action__chat"
                                >mdi-alert-circle</v-icon
                            >
                        </template>
                        <span>Thông tin về cuộc trò chuyện</span>
                    </v-tooltip>
                </div>
            </div>

            <div class="position-relative wrapperChatLayout">
                <div
                    class="position-absolute w-100 btn__chat--end d-flex justify-center align-items-center"
                >
                    <v-btn
                        :loading="setting"
                        :disabled="setting"
                        color="#343a40"
                        class="white--text action__chat mb-2"
                        fab
                        small
                        v-if="btnGoEndChat"
                        style="z-index: 200"
                        @click.stop="handleClickToBot()"
                    >
                        <v-icon dark color="#fff">mdi-arrow-down-thin</v-icon>
                    </v-btn>
                </div>
                <div
                    class="chat-messages p-4 scroll-custom chat__layout--body"
                    id="chatLayout"
                    ref="layoutChat"
                    @scroll="handleScroll"
                >
                    <div v-if="loadedMsg">
                        <wrapper-msg
                            @open-gll="openGll"
                            @loaded="loaded"
                            :type="typeChat"
                            v-for="(message, key) in messages"
                            :key="key"
                            :groupMsg="message"
                            :friendId="friendId"
                        >
                        </wrapper-msg>
                        <div v-if="turnProcess.length > 0">
                            <div
                                v-for="(arrPrc, key) in turnProcess"
                                :key="'turndd-' + key"
                            >
                                <loading-image
                                    :process="arrPrc"
                                ></loading-image>
                            </div>
                        </div>
                    </div>

                    <v-slide-y-reverse-transition mode="out-in">
                        <tying-chat
                            v-if="typing && !isGroup && !isLoading"
                        ></tying-chat>
                    </v-slide-y-reverse-transition>
                </div>
            </div>
            <div
                class="flex-grow-0 flex-1 d-flex position-relative chat__layout--footer"
                :class="[mediaRecord != null ? 'border-top' : '']"
            >
                <v-btn
                    :loading="setting"
                    :disabled="setting"
                    color="primary"
                    class="ma-2 white--text positon-ralative"
                    fab
                    small
                    @click.stop="toggleFormatMessage()"
                    style="z-index: 5000"
                >
                    <v-scroll-y-transition>
                        <div
                            class="group__message position-absolute"
                            ref="group__message"
                            v-show="showFormatMessage"
                            v-dav-click-outside="closeEvent"
                        >
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
                                    <span class="gmf__name">Đính kèm file</span>
                                </div>
                                <!-- <div
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
                                </div> -->
                                <div class="arrow-down position-absolute"></div>
                            </div>
                        </div>
                    </v-scroll-y-transition>
                    <v-icon dark>mdi-plus</v-icon>
                </v-btn>
                <!-- end btn format messsage -->
                <vue-record-audio
                    mode="hold"
                    @stream="onStream"
                    @result="onResult"
                />
                <!-- end btn record audio -->
                <div style="flex: 1" class="dav__wp-chat--input">
                    <div
                        class="preview__images--wp p-2"
                        :style="styleFilesPreview"
                        v-if="showPreviewFile"
                    >
                        <div
                            class="wp__item d-flex justify-content-start align-items-center flex-wrap w-100"
                        >
                            <preview-files
                                v-for="(file, index) in files"
                                :key="'file-preview-' + index"
                                :index="index"
                                :file="file"
                                :icon="false"
                                @delete-file="deleteImgPreview"
                            ></preview-files>
                            <preview-files
                                :icon="true"
                                @add-file="uploadFileImage"
                            ></preview-files>
                        </div>
                    </div>

                    <div
                        class="preview__images--wp p-2 preview--reply w-100 position-relative"
                        v-if="messageReply != null"
                    >
                        <div>
                            <v-icon
                                dark
                                size="22"
                                @click.stop="
                                    $store.commit('message/deleteMsgReply')
                                "
                                class="close__preview--reply position-absolute"
                                style="top: 10px; right: 40px; cursor: pointer"
                                >mdi-close</v-icon
                            >
                            <div
                                class="d-flex justify-content-start align-items-start flex-column"
                            >
                                <span class="small"
                                    >Đang trả lời {{ getRcv() }}</span
                                >
                                <span
                                    class="text-overflow message__pre__reply"
                                    v-if="messageReply.type_msg == 1"
                                >
                                    {{ messageReply.message.message }}
                                </span>
                                <span v-if="messageReply.type_msg == 2">
                                    {{
                                        messageReply.message.message.split(",")
                                            .length
                                    }}
                                    Hình Ảnh
                                </span>
                                <span v-if="messageReply.type_msg == 3">
                                    Tệp Âm Thanh
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="position-relative">
                        <div
                            class="position-absolute input__actions d-flex align-items-center"
                        >
                            <div class="position-relative">
                                <VEmojiPicker
                                    v-dav-click-outside="closeEmoji"
                                    v-if="showEmoji"
                                    :style="{ width: '270px' }"
                                    @select="onSelectEmoji"
                                    :i18n="langEmoji"
                                />
                            </div>
                            <v-icon
                                v-if="!mediaRecord"
                                dark
                                size="22"
                                @click.stop="showEmoji = true"
                                >mdi-emoticon</v-icon
                            >
                        </div>
                        <v-textarea
                            v-if="!mediaRecord"
                            @click:append-outer="sendMessage(1)"
                            append-outer-icon="mdi-send"
                            counter
                            clearable
                            clear-icon="mdi-close-circle"
                            @hook:updated="setHeightChatLayoutBody()"
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
                        <div
                            v-else
                            class="w-100 v-text-field--filled d-flex justify-content-start align-items-center"
                            style="height: 65px"
                        >
                            <v-icon
                                size="30"
                                color="pink"
                                class="cursor-pointer"
                                @click="mediaRecord = null"
                                >mdi-close-octagon</v-icon
                            >
                            <audio
                                :src="srcRecord"
                                ref="audioRecord"
                                class="mx-2"
                                style="border-radius: inherit; flex: 1"
                                controls
                            ></audio>
                            <v-icon
                                size="30"
                                color="primary"
                                class="cursor-pointer"
                                @click="sendMessage(6)"
                                >mdi-send</v-icon
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--  -->
        <!-- <div
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
        </div> -->
        <!--  -->
    </div>
</template>
<script>
import ItemMsg from "../components/chat/ItemMsg.vue";
import chat from "../mixin/servers/chat";
import ItemUser from "../components/users/ItemUser.vue";
import ItemMember from "../components/users/ItemMember.vue";
import ItemTying from "../components/chat/ItemTying.vue";
import TheSetting from "../components/users/group/TheSetting.vue";
import ItemPreImg from "../components/chat/ItemPreImg.vue";
import TyingChat from "../components/ui/TyingChat.vue";
import DavGallerySlideShow from "../components/davGallerySlideshow/davGallerySlideShow.vue";
import WrapperMsg from "../components/chat/WrapperMsg.vue";
import ItemUserReaction from "../components/chat/dialogReaction/ItemUserReaction";
import SkItemUser from "../components/skeleton/SkItemUser.vue";
import ChatBarMobile from "../components/layout/ChatBarMobile";
import TextSmall from "../components/ui/TextSmall";
import chatCall from "../mixin/servers/chatCall";
import SettingCall from "../components/chat/SettingCall.vue";
import PreviewFiles from "../components/files/PreviewFiles.vue";
import LoadingImage from "../components/files/LoadingImage.vue";
function initialState() {
    return {
        openFile: false,
        turnProcess: [],
        message: "",
        images: [],
        video: [],
        audio: [],
        files: [],
        showPreviewFile: false,
        search: "",
        parent_id: null,
        loadedRcv: false,
        loadedMsg: false,
        isLoading: false,
        seen: false,
        sending: false,
        disableChat: false,
        timeout: 4000,
        notification: false,
        text: "",
        checking: false,
        page: 1,
        endPage: null,
        btnGoEndChat: false,
        forcusScroll: false,
        dialog: false,
        setting: false,
        showFormatMessage: false,
        arrayImages: ["1", "2"],
        arrayFileAudio: [],
        mediaRecord: null,
        srcRecord: null,
        showPreviewImg: false,
        startImage: null,
        showEmoji: false,
        tabReationActive: "all",
        showChatInfo: false,
        friendInRoom: false,
        dialogSettingCall: false,
        reFetchRcv: 0,
        reFetchMessages: 0,
        gllMediaFile: {},
        cloudName: process.env.MIX_CLOUND_NAME,
        preset: process.env.MIX_CLOUND_PRESET,
        tags: "browser-upload",
        messageImage: [],
        queueTurn: null,
        sendTurn: 0,
        validatorFile: {
            size: 50 * 1024 * 1024, // 50MB
        },
    };
}

export default {
    components: {
        LoadingImage,
        PreviewFiles,
        ItemMsg,
        ItemUser,
        ItemMember,
        ItemTying,
        TheSetting,
        ItemPreImg,
        TyingChat,
        DavGallerySlideShow,
        WrapperMsg,
        ItemUserReaction,
        SkItemUser,
        ChatBarMobile,
        TextSmall,
        SettingCall,
    },
    mixins: [chat, chatCall],
    props: ["friendId"],
    data() {
        return initialState();
    },
    beforeCreate() {
        localStorage.setItem("saveScrollHeight", 0);
        if (this.$route.name == "group") {
            axios
                .get(
                    route("auth.group", {
                        groupId: this.$route.params.friendId,
                    })
                )
                .then((req) => {})
                .catch((err) => {});
        }
    },
    async created() {
        this.setType();
        this.$store.dispatch("message/reset");
        this.setup();
        this.$nextTick(async () => {
            await this.setReceiver();
            if (this.typeChat == 0) {
                Echo.leave(`group-chat-${this.friendId}`);
                Echo.leave(`chat-${this.friendId}`);
                this.server(this.friendId);
            } else {
                Echo.leave(`chat-${this.friendId}`);
                Echo.leave(`group-chat-${this.friendId}`);
                this.serverGroup(this.friendId);
            }
        });
    },
    async mounted() {
        this.$nextTick(async () => {
            this.setHeightChatLayoutBody();
            this.getMessages(false);
            this.updateSeen(this.friendId);
        });
    },
    updated() {
        this.setHeightChatLayoutBody();
    },
    directives: {
        focus: {
            inserted(el) {
                el.focus();
            },
        },
    },
    computed: {
        progressImg() {
            return this.$store.getters["message/progressImg"];
        },
        styleFilesPreview() {
            const parent = document.querySelector(
                ".dav__wp-chat--input .v-input__control"
            );
            const style = {
                width: parent.offsetWidth + "px",
            };
            return style;
        },
        activeReply() {
            return this.$store.getters["message/activeReply"];
        },
        blockLoadImg() {
            return this.$store.getters["message/blockLoadImg"];
        },
        inRoom() {
            return this.$store.getters["message/rcvInRoom"];
        },
        streamId() {
            return this.authId + this.makeStreamId(10);
        },
        statusText() {
            if (this.isOnline(this.receiver.id)) {
                return "Đang hoạt động";
            }
            return "Hoạt động " + this.formatTime(this.receiver.offline_at);
        },
        typeChat() {
            return this.$store.getters["message/typeChat"];
        },
        amountReaction() {
            return this.$store.getters["message/amountReaction"];
        },
        rootReaction() {
            return this.$store.getters["message/rootReaction"];
        },
        dialogReaction: {
            get() {
                return this.$store.getters["message/dialogReaction"];
            },
            set(value) {
                if (value) {
                    return this.$store.commit(
                        "message/actionDialogReaction",
                        "open"
                    );
                } else {
                    return this.$store.commit(
                        "message/actionDialogReaction",
                        "close"
                    );
                }
            },
        },
        allReaction() {
            return this.$store.getters["message/allReaction"];
        },
        groupReaction() {
            return this.$store.getters["message/groupReaction"];
        },
        messageReply() {
            return this.$store.getters["message/messageReply"];
        },
        media() {
            return this.$store.getters["message/messengerMedia"];
        },
        members() {
            if (this.isGroup && this.loadedRcv) {
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
            if (this.isGroup && this.loadedRcv) {
                return this.authId == this.receiver.users_id;
            }
        },
        isMod() {
            if (this.loadedRcv && this.isGroup) {
                const user = this.receiver.members.find(
                    (user) => user.users_id == this.authId
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
        messages() {
            return this.$store.getters["message/messages"];
        },
        isChatting() {
            return this.$store.getters["message/isChatting"];
        },
    },

    methods: {
        closeGllFile: function () {
            this.startImage = null;
        },
        upload: function (payload = {}, isLast = false, turn = 0) {
            let reader = new FileReader();
            let formData = new FormData();
            reader.addEventListener(
                "load",
                function () {
                    payload["url"] = reader.result;
                    formData.append("upload_preset", this.preset);
                    formData.append("tags", this.tags);
                    formData.append("folder", "test/file");
                    formData.append("file", payload["url"]);
                    let cloudinaryUploadURL = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
                    const indexPrc = this.setProcess(payload, turn);
                    let requestObj = {
                        url: cloudinaryUploadURL,
                        method: "POST",
                        data: formData,
                        onUploadProgress: function (progressEvent) {
                            var process = Math.round(
                                (progressEvent.loaded * 100.0) /
                                    progressEvent.total
                            );
                            this.updateProcess(indexPrc, turn, process);
                        }.bind(this),
                    };
                    var instance = axios.create();
                    delete instance.defaults.headers.common["X-Socket-Id"];
                    instance(requestObj)
                        .then(async (req) => {
                            const data = req.data;
                            this.removeProcess(indexPrc, turn);
                            console.log(payload.type);
                            if (this.typem("image") == payload.type) {
                                if (!Array.isArray(this.messageImage[turn])) {
                                    this.messageImage[turn] = [];
                                }
                                this.messageImage[turn].push(data.secure_url);
                                if (isLast) {
                                    data.secure_url =
                                        this.messageImage[turn].toString();
                                    await this.apiSendMsg(
                                        payload.type,
                                        data.secure_url
                                    );
                                    this.messageImage.splice(turn, 1);
                                }
                            } else {
                                await this.apiSendMsg(
                                    payload.type,
                                    data.secure_url
                                );
                            }
                        })
                        .catch((err) => {
                            this.removeProcess(indexPrc, turn);
                        });
                }.bind(this),
                false
            );
            // call for file read if there is a file
            if (payload.file && payload.file.name) {
                if (this.fileValid(payload.file)) {
                    reader.readAsDataURL(payload.file);
                }
            }
        },
        isLastImage(id) {
            return id == this.images[this.images.length - 1].id;
        },
        goToReply(msgId) {
            const prefix = "pack__msg--";
            const id = prefix + msgId;
            const el = document.getElementById(id);
            const listMsg = document.getElementsByClassName("activeReply");
            if (listMsg.length > 0) {
                Array.from(listMsg).forEach((ele) => {
                    ele.classList.remove("activeReply");
                });
            }
            if (el) {
                el.classList.add("activeReply");
                this.scrollElement(el);
                // this.$store.commit("message/setActiveReply", null);
            } else {
                this.getMessages(false, msgId);
            }
        },
        scrollElement(child) {
            const activeMsg = child;
            const parent = document.getElementById("chatLayout");
            if (!this.isChat || !activeMsg || !parent) {
                return;
            }
            const pos = activeMsg.offsetTop;
            return (parent.scrollTop = pos - 200);
        },
        settingCall(p) {
            this.dialogSettingCall = p;
        },
        urlCall(hasVideo = false) {
            const route = this.$router.resolve({
                name: "call__chat",
                params: { streamId: this.authId + this.makeStreamId(15) },
                query: {
                    receiver: this.receiver.id,
                    broadcaster: this.authId,
                    type: this.typeChat,
                    has_video: hasVideo,
                },
            });
            return route.href;
        },
        async offerCall(hasVideo = false) {
            if (this.isGroup) {
                return alert("Coming Soon.........");
            }
            this.goCallRoom(this.urlCall(hasVideo));
        },
        makeStreamId(length) {
            var result = "";
            var characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(
                    Math.floor(Math.random() * charactersLength)
                );
            }
            return result;
        },

        loadReaction(index) {
            this.tabReationActive = index;
            let data = this.groupReaction[index];
            if (index == "all") {
                data = this.rootReaction;
            }
            this.$nextTick(() => {
                this.$store.commit("message/updateAllReaction", data);
            });
        },
        openDialogReaction(data) {
            this.allReaction = data.allReaction;
            this.groupReaction = data.groupReaction;
        },
        closeEmoji: function () {
            this.showEmoji = false;
        },
        onSelectEmoji: function (emoji) {
            this.message += " " + emoji.data;
        },
        openGll: function (e) {
            console.log(e);
            const index = this.media.findIndex((image) => {
                return image.msg_id == e.msgId && image.index == e.index;
            });
            if (index != -1) {
                this.startImage = Number(index);
            }
            return;
        },
        log(val) {
            console.log(val);
        },
        fileValid: function (file) {
            if (file && file.size) {
                return file.size <= this.validatorFile.size;
            }
            return false;
        },
        // updateSrcImg() {
        //     for (let i = 0; i < this.images.length; i++) {
        //         let reader = new FileReader();
        //         reader.onload = (e) => {
        //             const el = document.getElementsByClassName(
        //                 "image__preview--" + i
        //             );
        //             if (el.length == 1) {
        //                 el[0].src = reader.result;
        //             }
        //         };

        //         reader.readAsDataURL(this.images[i]);
        //     }
        // },
        deleteImgPreview(index) {
            return this.files.splice(index, 1);
        },
        handleClickToBot() {
            this.deleteSavedScroll();
            return this.scrollEnd(true);
        },

        setHeightChatLayoutBody(height = 0, width = 0) {
            let elMain = this.windowHeight;
            const header = document.getElementById("main__app__bar");

            if (this.isIpadProUp) {
                elMain = elMain - header.offsetHeight;
            }
            const elTextInput = document.querySelector(
                ".dav__wp-chat--input .v-textarea"
            );
            if (elTextInput != null) {
                if (this.showPreviewImg == true) {
                    elTextInput.classList.add("br-0");
                } else {
                    elTextInput.classList.remove("br-0");
                }
            }
            const elBody =
                document.getElementsByClassName("chat__layout--body")[0];
            const el1 = document.getElementsByClassName(
                "chat__layout--header"
            )[0];
            const el2 = document.getElementsByClassName(
                "chat__layout--footer"
            )[0];
            let hEl1 = 0,
                hEl2 = 0,
                sum = 0;

            if (el1 != null) {
                hEl1 = this.getAbsoluteHeight(el1);
            }
            if (el2 != null) {
                hEl2 = this.getAbsoluteHeight(el2);
            }

            if (elMain != null) {
                sum = elMain - (hEl1 + hEl2);
                sum = sum + "px";
                if (elBody != null) {
                    elBody.style.height = sum;
                }
            }
        },
        toggleFormatMessage() {
            return (this.showFormatMessage = !this.showFormatMessage);
        },
        closeDialog(close) {
            this.dialog = false;
        },
        setType() {
            let typeChat = 0;
            if (this.isGroup) {
                typeChat = 1;
            }
            return this.$store.commit("message/setTypeChat", typeChat);
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
            if (this.typeChat == 1) {
                this.checking = true;
            }
            await this.$store
                .dispatch("message/getReceiver", {
                    contactId: this.friendId,
                    type: this.typeChat,
                })
                .then((req) => {
                    this.reFetchRcv = 0;
                    if (this.typeChat == 1) {
                        if (
                            !this.receiver.members.find(
                                (user) => user.users_id == this.authId
                            )
                        ) {
                            this.checking = false;
                            return this.$router.push({ name: "home" });
                        }
                        this.checking = false;
                    }
                    this.loadedRcv = true;
                })
                .catch((err) => {
                    if (this.reFetchRcv > 4) {
                        this.notification = true;
                        this.text =
                            "Load tin người nhận thất bại bạn vui lòng nhấn F5 để thử lại hoặc Refresh lại trang ";
                    } else {
                        this.reFetchRcv++;
                        this.setReceiver();
                    }
                });
        },
        onStream(data) {},
        onResult(data) {
            this.mediaRecord = data;
            this.srcRecord = window.URL.createObjectURL(data);
        },
        async getMessages(up = false, msgId = null) {
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
                        conversationId: this.friendId,
                        type: this.typeChat,
                        page: this.page,
                        msgId: msgId,
                    })
                    .then((req) => {
                        this.reFetchMessages = 0;
                        this.endPage = req.data.endPage;
                        this.isLoading = false;
                        this.loadedMsg = true;
                        this.$nextTick(() => {
                            if (up && !msgId) {
                                this.scrollEnd(true);
                            } else {
                                this.scrollEnd(true, true);
                            }
                            if (msgId) {
                                this.goToReply(msgId);
                            }
                            this.endSetup();
                        });
                    })
                    .catch((err) => {
                        this.isLoading = false;
                        if (this.reFetchMessages > 4) {
                            this.notification = true;
                            this.text =
                                "Load tin nhắn thất bại bạn vui lòng nhấn F5 để thử lại hoặc Refresh lại trang ";
                        } else {
                            this.reFetchMessages++;
                            this.getMessages(up);
                        }
                        this.$nextTick(() => {
                            this.scrollEnd(true, true);
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
            if (this.typeChat == 0) {
                let typing = false;
                if (
                    this.message != "" &&
                    this.messages != null &&
                    this.messages
                ) {
                    typing = true;
                }
                Echo.private(`chat-${this.receiver.id}`).whisper("typing", {
                    sender_id: this.authId,
                    typing: typing,
                });
            } else {
                return;
            }
        },
        loaded(sd_id) {
            if (
                !this.blockLoadImg ||
                sd_id == this.authId ||
                !this.isPointBlockScroll()
            ) {
                if (this.activeReply) {
                    return;
                }
                this.scrollEnd(true);
            }
        },
        //   THUẬT TOÁN ĐỂ LOAD REPLY : LÂY SỐ ITEM CÓ ĐƯỢC VD 134 CELI(134/20) = PAGE LOAD THEO PAGE XONG SCROLL TOP TO VIẾT TRONG HÀM MESSAGES
        resetAll() {
            this.mediaRecord = null;
            this.sending = false;
            this.disableChat = false;
            this.message = "";
            this.images = [];
            this.showEmoji = false;
        },
        uploadFileImage() {
            this.$refs.messageImage.click();
        },
        uploadFileAudio() {
            this.$refs.messageAudio.click();
        },
        uploadFileVideo() {
            this.$refs.messageVideo.click();
        },
        changeAudioToSendMessage(e) {
            this.audio = e.target.files[0];
            this.sendMessage(3);
        },
        changeVideoToSendMessage(e) {
            let selectedVideo = e.target.files;
            let length = selectedVideo.length;
            for (let i = 0; i < length; i++) {
                this.video.push(selectedVideo[i]);
            }
            if (this.video.length > 0) {
                this.showPreviewImg = true;
            }
        },

        changeToSendMessage(e) {
            let selectedFiles = e.target.files;
            if (selectedFiles.length <= 0) {
                return (this.files = []);
            }
            this.showPreviewFile = true;
            for (let i = 0; i < selectedFiles.length; i++) {
                let type = selectedFiles[i].type.split("/")[0];
                this.files.push({
                    type: type,
                    file: selectedFiles[i],
                });
                // this.pushFile(type, index, selectedFiles[i]);
            }
            this.$refs.messageImage.value = null;
            // const images = [];
            // const audio = [];
            // const video = [];
            // for (let index = 0; index < this.files.length; index++) {
            //     const type = this.files[index].type;
            //     const file = this.files[index].file;
            //     const data = {
            //         id: index,
            //         file: file,
            //         type: type,
            //     };
            //     switch (type) {
            //         case "image":
            //             images.push(data);
            //             break;
            //         case "audio":
            //             audio.push(data);
            //             break;
            //         case "video":
            //             video.push(data);
            //             break;
            //         default:
            //             break;
            //     }
            // }
            // this.images = images;
            // this.video = video;
            // this.audio = audio;
            // if (this.files.length > 0) {
            //     this.showPreviewImg = true;
            // }
            // this.updateSrcImg();
            // this.setHeightChatLayoutBody();
        },
        pushFile: function (type, id, info) {
            const file = info.file;
            const data = {
                id: id,
                file: file,
                type: type,
            };
            switch (type) {
                case "image":
                    this.images.push(data);
                    break;
                case "audio":
                    this.audio.push(data);
                    break;
                case "video":
                    this.video.push(data);
                    break;
                default:
                    break;
            }
        },
        sendMessage: async function (type) {
            if (!this.message && this.files.length <= 0 && !this.mediaRecord) {
                this.resetAll();
                alert("U là trời có nhắn cái gì đâu mà gửi troài =))");
            } else {
                this.sendTurn = this.sendTurn + 1;
                this.$store.commit("message/deleteMsgReply");
                this.showPreviewFile = false;
                const images = this.images;
                const video = this.video;
                const audio = this.audio;
                const turn = this.turnProcess.push([]) - 1;
                this.files = [];
                if (this.message) {
                    this.apiSendMsg(this.typem("text"), this.message);
                }
                if (images.length > 0) {
                    for (let im = 0; im < images.length; im++) {
                        var dim = null,
                            imgId = null;
                        dim = images[im];
                        let isLast = false;
                        if (im == images.length - 1) {
                            isLast = true;
                        }

                        imgId =
                            String(turn) +
                            String(dim.id) +
                            this.makeStreamId(7);
                        const payload = {
                            id: imgId,
                            file: dim.file,
                            type: this.typem(dim.type),
                        };
                        await this.upload(payload, isLast, turn);
                    }
                }
                if (audio.length > 0) {
                    for (let ia = 0; ia < audio.length; ia++) {
                        var dia = null,
                            auId = null;
                        dia = audio[ia];
                        auId =
                            String(turn) +
                            String(dia.id) +
                            this.makeStreamId(7);
                        const payload = {
                            id: auId,
                            file: dia.file,
                            type: this.typem(dia.type),
                        };
                        await this.upload(payload, false, turn);
                    }
                }
                if (video.length > 0) {
                    for (let iv = 0; iv < video.length; iv++) {
                        var div = null,
                            vidId = null;
                        div = video[iv];
                        vidId =
                            String(turn) +
                            String(div.id) +
                            this.makeStreamId(7);
                        const payload = {
                            id: vidId,
                            file: div.file,
                            type: this.typem(div.type),
                        };
                        await this.upload(payload, false, turn);
                    }
                }
                // if (this.mediaRecord) {
                //     this.apiSendMsg(6, created_time);
                // }
            }
        },
        initUpload(array = []) {},
        removeKeyFile(key = 0, id = null) {
            switch (key) {
                case this.typem("image"):
                    this.images = this.images.filter((element) => {
                        return element.id != id;
                    });
                    break;
                case this.typem("video"):
                    this.video = this.video.filter((element) => {
                        return element.id != id;
                    });
                    break;
                case this.typem("audio"):
                    this.audio = this.audio.filter((element) => {
                        return element.id != id;
                    });
                    break;
                default:
                    break;
            }
        },
        apiSendMsg: function (type = 0, message = "") {
            const seen = this.inRoom ? true : false;
            let payload = {
                to: this.friendId,
                from: this.authId,
                messageReply: this.messageReply,
                seen: seen,
                typeMsg: type,
                message: message,
            };
            this.$store
                .dispatch("message/sendMessage", payload)
                .then((req) => {
                    if (type == 1) {
                        this.message = "";
                    }
                    this.scrollEnd(true, true);
                })
                .catch((err) => {
                    if (type == 1) {
                        this.message = "";
                    }
                    this.scrollEnd(true, true);
                });
        },
        closeEvent() {
            this.showFormatMessage = false;
        },
        removeProcess(indexPrc, turn) {
            return this.turnProcess[turn].splice(indexPrc);
        },
        updateProcess(indexPrc, turn, process) {
            return this.$set(
                this.turnProcess[turn][indexPrc],
                "process",
                process
            );
        },

        setProcess(payload, turn) {
            const data = {
                url: payload.url,
                id: payload.id,
                process: 0,
                turn: turn,
                type: this.typem(payload.type),
            };
            var indexPrc = this.turnProcess[turn].push(data) - 1;
            return indexPrc;
        },
        groupByTypeProcess: function (collection, property) {
            var val,
                index,
                values = [],
                result = [];
            for (var i = 0; i < collection.length; i++) {
                val = collection[i][property];
                index = values.indexOf(val);
                if (index > -1) result[index].push(collection[i]);
                else {
                    values.push(val);
                    result.push([collection[i]]);
                }
            }
            return result;
        },
        resetProcess(type, id = null) {
            switch (type) {
                case "image":
                    this.processImage = [];
                    break;
                case "video":
                    const myArray = this.processVideo.filter(function (obj) {
                        return obj.id != id;
                    });
                    this.processVideo = myArray;
                default:
                    break;
            }
            return;
        },
        resetFile(type, id = null) {
            switch (type) {
                case 1:
                    this.message = "";
                    break;
                case 2:
                    this.files = this.removeKeyFile("image");

                    break;
                case 3:
                    this.files = this.removeKeyFile("audio", id);

                    break;
                case 6:
                    this.record = null;
                    break;
                case 7:
                    this.files = this.removeKeyFile("video", id);

                    break;
                default:
                    break;
            }
        },
        resetLoad() {
            this.setType(null);
            Object.assign(this.$data, initialState());
        },
    },
    watch: {
        startImage(nv) {
            this.openFile = nv != null ? true : false;
        },
        turnProcess(nv) {
            this.scrollEnd(true);
        },
        files(newval) {
            if (this.files.length <= 0) {
                this.audio = [];
                this.video = [];
                this.images = [];
                this.showPreviewFile = false;
                return;
            }
            this.showPreviewFile = true;
            const images = [];
            const audio = [];
            const video = [];
            for (let index = 0; index < this.files.length; index++) {
                const type = this.files[index].type;
                const file = this.files[index].file;
                const data = {
                    id: index,
                    file: file,
                    type: type,
                };
                switch (type) {
                    case "image":
                        images.push(data);
                        break;
                    case "audio":
                        audio.push(data);
                        break;
                    case "video":
                        video.push(data);
                        break;
                    default:
                        break;
                }
            }
            this.images = images;
            this.video = video;
            this.audio = audio;
        },
        async friendId(newVal, oldVal) {
            localStorage.setItem("saveScrollHeight", 0);
            this.$store.dispatch("message/reset");
            this.resetLoad();
            this.setting = true;
            this.disableChat = true;
            this.checking = false;
            this.setType();
            this.$nextTick(async () => {
                this.setReceiver();
                if (this.typeChat == 0) {
                    Echo.leave(`group-chat-${oldVal}`);
                    Echo.leave(`chat-${oldVal}`);
                    this.server(newVal);
                    this.updateSeen(newVal);
                } else {
                    Echo.leave(`chat-${oldVal}`);
                    Echo.leave(`group-chat-${oldVal}`);
                    this.serverGroup(newVal);
                }
                this.getMessages(false);
            });
        },
        page(newVal) {
            if (newVal > 1) {
                this.getMessages(true);
            }
        },
        showPreviewImg(newVal) {
            const el = document.querySelector(
                ".dav__wp-chat--input .v-textarea"
            );
            if (newVal == true && el != null) {
                el.classList.add("br-0");
                this.scrollEnd();
            } else {
                el.classList.remove("br-0");
            }
        },
        windowHeight(newVal) {
            this.setHeightChatLayoutBody();
            this.scrollEnd(true);
        },
        windowWidth(newVal) {
            this.setHeightChatLayoutBody();
            this.scrollEnd(true);
        },
        activeReply(msgId) {
            if (msgId != null) {
                this.goToReply(msgId);
            }
        },
    },
};
</script>
<style lang="scss">
.message__pre__reply {
    max-width: 450px;
}
.activeReply {
    .wp-chat-item {
        border: 2px solid #6610f2 !important;
        border-radius: inherit;
    }
}
.wrapper__layout {
    &--chat {
        flex: 0 0 80%;
        max-width: 80%;
    }
}
.action__chat {
    margin-right: 40px;
}
.vue-audio-recorder {
    width: 40px !important;
    height: 40px !important;
    margin: 8px !important;
}
#chatLayout {
    padding-left: 10px !important;
    padding-right: 10px !important;
}
#dialog__reaction {
    &--nav {
        .tab__reaction {
            // &--item.--all {
            // }
            &--item.active {
                color: #1d8ecd;
                border-bottom: 2px solid #1d8ecd;
            }
            &--item {
                cursor: pointer;
                &:hover {
                    background: #b0b3b8;
                    color: #fff;
                    border-radius: 8px;
                }
                align-items: center;
                color: #b0b3b8;
                display: flex;
                font-size: 0.9375rem;
                line-height: 0px;
                height: 60px;
                min-height: 16px;
                padding: 0 16px;
                transition: 0.2s all;
            }
        }
    }
    &--content {
        min-height: 200px;
        max-height: 400px;
        overflow: auto;
    }
}

.input__actions {
    top: 18px;
    right: 45px;
    button {
        z-index: 100;
        cursor: pointer;
        &:hover {
            color: #1d8ecd;
        }
    }
    .emoji-picker {
        top: 28px !important;
        right: -10px !important;
        z-index: 200;
    }
}
.v-input__append-outer {
    margin-right: 6px;
    cursor: pointer;
}
.v-input__append-inner {
    padding-right: 20px;
}
#EmojiPicker {
    background-color: #1c1e21 !important;
}
#Categories::-webkit-scrollbar-track {
    // -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #3e4042;
    opacity: 0.3;
}
#InputSearch {
    display: none !important;
}
#Categories::-webkit-scrollbar {
    height: 7px;
    background-color: #f5f5f5;
}

#Categories::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: var(--bs-gray-dark);
}
.container-emoji {
    height: 200px !important;
}
.emoji {
    border: none !important;
    font-size: 20px !important;
}
.emoji-picker {
    position: absolute !important;
    top: -244px;
}
.v-application--is-ltr
    .v-textarea.v-text-field--enclosed
    .v-text-field__slot
    textarea {
    padding-right: 40px !important;
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
    .emoji-picker {
        right: 8px !important;
    }
}

#chatLayout {
    height: 100%;
}
// .wp__item {
//     span {
//         width: 100%;
//         flex-wrap: wrap;
//         justify-content: flex-start;
//         align-items: center;
//         display: flex;
//     }
// }
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
        &--wp {
            background: hsla(0, 0%, 100%, 0.08);
            border-radius: 4px 4px 0 0 !important;
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
    padding: 100px 0 0 0 !important;
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

// @media only screen and (max-width: 767px) {
//     .chat-app .people-list {
//         height: 465px;
//         width: 100%;
//         overflow-x: auto;
//         background: #fff;
//         left: -400px;
//         display: none;
//     }
//     .chat-app .people-list.open {
//         left: 0;
//     }
//     .chat-app .chat {
//         margin: 0;
//     }
//     .chat-app .chat .chat-header {
//         border-radius: 0.55rem 0.55rem 0 0;
//     }
//     .chat-app .chat-history {
//         height: 300px;
//         overflow-x: auto;
//     }
// }

// @media only screen and (min-width: 768px) and (max-width: 992px) {
//     .chat-app .chat-list {
//         height: 650px;
//         overflow-x: auto;
//     }
//     .chat-app .chat-history {
//         height: 600px;
//         overflow-x: auto;
//     }
// }

// @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
//     .chat-app .chat-list {
//         height: 480px;
//         overflow-x: auto;
//     }
//     .chat-app .chat-history {
//         height: calc(100vh - 350px);
//         overflow-x: auto;
//     }
// }
</style>
