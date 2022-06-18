<template>
    <div
        class="package__msg"
        @mouseover="showActions = true"
        @mouseleave="showActions = false"
    >
        <item-msg-reply
            :message_parent="data.message_parent"
            @load="loaded"
            :itMe="itMe"
            v-if="data.message_parent != null"
        ></item-msg-reply>
        <div
            class="chat-message w-100 h-100 position-relative"
            v-if="data.message.type != 4"
            :class="[itMe ? ['chat-message-right'] : ['chat-message-left']]"
        >
            <reaction-msg
                :reaction="reaction"
                :lengthReaction="lengthReaction"
                :itMe="itMe"
                @set-reaction-dialog="setReactionDialog"
            ></reaction-msg>
            <div
                class="d-flex flex-column align-items-center justify-content-end"
            >
                <img
                    v-if="!itMe"
                    :src="makeAvatar(receiver.avatar)"
                    class="rounded-circle mr-1"
                    :class="{ invisible: !isLast }"
                    :alt="receiver.name"
                    width="28"
                    height="28"
                />
                <!-- <div
                    class="text-muted text-nowrap mt-2"
                    :class="[itMe ? [''] : ['mx-2']]"
                >
                    {{ formatTime(data.message.created_at) }}
                </div> -->
            </div>

            <div
                class="flex-shrink-1 mr-2 mr-2 d-flex flex-column wp-chat-item"
            >
                <div
                    class="chat-item"
                    :class="[
                        renderClass,
                        isGroup ? ['royal-role-' + role] : '',
                        ['msg-' + data.message.id],
                        !isChat ? ['px-3', 'py-2'] : 'h-100',
                    ]"
                    v-if="type == 1"
                >
                    <div
                        v-if="isGroup"
                        class="font-weight-bold mb-1 name-sender d-flex justify-center-start align-items-center position-relative"
                        :class="'name-royal-role-' + role"
                    >
                        <span class="d-block">{{
                            itMe ? "You" : data.sender.name
                        }}</span>
                        <div class="flex-1 ml-2 mb-1" v-if="isGroup">
                            <the-role
                                :role="role"
                                :width="20"
                                :height="20"
                            ></the-role>
                        </div>
                    </div>
                    <div
                        class="text-chat"
                        v-html="
                            MakeMessage(data.message.message, data.message.id)
                        "
                    ></div>
                </div>
            </div>
            <div
                class="message__image wp-chat-item"
                v-if="data.message.type == 2"
                :class="[itMe ? ['mr-2'] : ['ml-2'], images ? ['images'] : '']"
            >
                <a
                    v-if="!images"
                    class="dav__gll--item"
                    @click.stop="openGll(0)"
                >
                    <img
                        @load="loaded"
                        :src="data.message.message"
                        class="img__obj--cover"
                        style="
                            border-radius: 8px;
                            max-width: 250px;
                            max-height: 250px;
                        "
                    />
                </a>
                <div
                    v-else
                    class="d-flex message__image--images align-items-center flex-wrap w-100 h-100"
                    :class="
                        itMe ? 'justify-content-end' : 'justify-content-start'
                    "
                >
                    <div
                        v-for="(image, index) in arrayImage"
                        :key="'image-' + index"
                        @click.stop="openGll(index)"
                        class="message__image--item dav__gll--item"
                    >
                        <a>
                            <img
                                @load="loaded"
                                :src="image"
                                width="100%"
                                height="100%"
                                style="border-radius: 8px"
                                class="img__obj--cover"
                            />
                        </a>
                    </div>
                </div>
            </div>

            <div
                class="flex-shrink-1 mr-3 message__audio wp-chat-item"
                v-if="type == 3"
            >
                <vue-plyr>
                    <audio controls crossorigin playsinline>
                        <source
                            :src="data.message.message"
                            type="audio/mp3"
                            @canplay="loaded"
                        />
                    </audio>
                </vue-plyr>
            </div>
            <div
                class="message__actions mr-3 my-auto"
                v-if="showActions || showDialog"
            >
                <div
                    class="d-flex align-items-center"
                    :class="{ 'flex-row-reverse': itMe }"
                >
                    <div
                        @click.stop="replyMessage"
                        class="message__actions--reply"
                    >
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                    style="line-height: 20.1px; cursor: pointer"
                                    dark
                                    size="19"
                                    v-bind="attrs"
                                    v-on="on"
                                    color="#adb5bd"
                                    >mdi-arrow-left-top-bold</v-icon
                                >
                            </template>
                            <span>Trả lời</span>
                        </v-tooltip>
                    </div>
                    <div class="message__actions--reaction mx-3">
                        <v-icon dark size="20" @click.stop="showDialog = true"
                            >mdi-emoticon-outline</v-icon
                        >
                        <VEmojiPicker
                            v-click-outside="handle"
                            v-if="showDialog"
                            :style="{ width: '270px' }"
                            @select="onSelectEmoji"
                            :i18n="langEmoji"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="pb-4 chat-message-system small" v-else>
            {{ data.message.message }} {{ formatTime(data.message.created_at) }}
        </div>
    </div>
</template>
<script>
import user from "../../mixin/user";
import TheRole from "../role/TheRole.vue";
import ItemMsgReply from "./ItemMsgReply.vue";
import ReactionMsg from "./ReactionMsg.vue";
export default {
    props: ["data", "typeUserMsg", "length", "index", "last"],
    mixins: [user],
    components: {
        // VuetifyAudio: () => import("vuetify-audio"),
        TheRole,
        ItemMsgReply,
        ReactionMsg,
    },
    data() {
        return {
            interval: null,
            metaData: false,
            arrayFetch: [],
            arrayImage: [],
            showActions: false,
            search: "",
            showDialog: false,
        };
    },
    created() {
        if (this.data.type_msg == 2) {
            this.arrayImage = this.data.message.message.split(",");
        }
        this.created_at = this.data.message.created_at;
    },
    async mounted() {},
    computed: {
        isNullReaction() {
            if (
                !this.data.message.reaction ||
                this.data.message.reaction.length < 1
            ) {
                return true;
            }
            return false;
        },
        reaction() {
            if (this.isNullReaction) {
                return null;
            }
            const unique = [
                ...new Set(
                    this.data.message.reaction.map((item) => item.reaction)
                ),
            ];
            return unique;
        },
        groupedReaction() {
            const reaction = this.data.message.reaction.reduce(
                (reaction, icon) => {
                    const group = reaction[icon.reaction] || [];
                    group.push(icon);
                    reaction[icon.reaction] = group;
                    return reaction;
                },
                {}
            );
            return reaction;
        },

        lengthReaction() {
            if (this.isNullReaction) {
                return 0;
            }
            return this.data.message.reaction.length;
        },
        bindClassType() {
            if (this.data.type_msg == 1) {
                return "chat-message-text";
            } else if (this.data.type_msg == 2) {
                return "chat-message-images";
            } else if (this.data.type_msg == 3) {
                return "chat-message-audio";
            }
        },
        isLast() {
            return Number(this.last.msg_id) === Number(this.data.msg_id);
        },
        encryptedId() {
            return this.$CryptoJS.AES.encrypt(
                this.data.message.id + "",
                "Secret ID"
            ).toString();
        },
        images() {
            return this.arrayImage.length > 1;
        },
        setHaveLink() {
            const links = document.getElementsByClassName(
                "msg__link--" + this.data.message.id
            );
            if (links.length > 0) {
                document
                    .getElementsByClassName("msg-" + this.data.message.id)[0]
                    .classList.add("haveLink");
                const url = links[0].getAttribute("data-url-fetch");
                this.fetchMeataData(url);
            }
        },
        getArray() {
            return this.MakeMessage(
                this.data.message.message,
                this.data.message.id
            );
        },
        createBackgroundImage() {
            return (
                "background-image: radial-gradient(circle, rgba(0, 0, 0, 0) 25%, rgba(24, 24, 24, 1) 75%),url(" +
                this.data.message.message +
                ");background-size: cover;"
            );
        },
        createBgAudio() {
            return "background-image: radial-gradient(circle, rgba(0, 0, 0, 0) 25%, rgba(24, 24, 24, 1) 75%);background-size: cover;";
        },
        itMe() {
            return this.data.sd_id == this.id;
        },
        isGroup() {
            return this.typeUserMsg == 1;
        },
        type() {
            return this.data.message.type;
        },

        getUser() {
            const user = this.receiver.members.find(
                (user) => user.users_id == this.data.sd_id
            );
            return user;
        },
        renderClass() {
            if (!this.isGroup) {
                if (this.itMe) {
                    return "me-chat";
                } else {
                    return "friend-chat";
                }
            }
            return;
        },
        role() {
            if (this.getUser) {
                return this.getUser.role;
            } else {
                return 1;
            }
        },
    },
    methods: {
        async setReactionDialog() {
            if (!this.isNullReaction) {
                await this.$store.commit(
                    "message/setReactionDialog",
                    this.data.message.reaction
                );
            }
        },
        onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        },
        handle() {
            this.showDialog = false;
        },
        toogleDialogEmoji() {
            console.log("Toogle!");
            this.showDialog = !this.showDialog;
        },
        async onSelectEmoji(emoji) {
            await this.$store
                .dispatch("message/saveReaction", {
                    rcvId: this.receiver.id,
                    type: this.typeUserMsg,
                    reaction: emoji.data,
                    msgId: this.data.message.id,
                })
                .then((req) => {})
                .catch((err) => {});
        },

        replyMessage() {
            return this.$store.dispatch("message/getMessageReply", this.data);
        },
        openGll(index) {
            const data = {
                index: index,
                msgId: this.data.message.id,
            };
            this.$emit("open-gll", data);
        },
        async fetchMeataData(url) {
            await axios
                .get("https://jsonlink.io/api/extract", {
                    params: { url: url },
                })
                .then((req) => {
                    return (this.metaData = req.data);
                })
                .catch((err) => {
                    return (this.metaData = false);
                });
        },
        loaded() {
            return this.$emit("loaded");
        },
        haveHttps(url = "") {
            let newUrl = window.decodeURIComponent(url);
            newUrl = newUrl.trim().replace(/\s/g, "");

            if (/^(:\/\/)/.test(newUrl)) {
                return `http${newUrl}`;
            }
            if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
                return false;
            }
        },
        createElement(url, goUrl) {
            var a = document.createElement("a");
            var linkText = document.createTextNode(url);
            a.appendChild(linkText);
            a.title = url;
            a.href = goUrl;
            a.target = "_blank";
            a.classList.add("chat__text--link");
            return a;
        },
        MakeMessage(message, id) {
            let goUrl = "",
                fetchDataUrl = "";
            let url =
                /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
            let startWith = /^((http|https|Http|Https|rtsp|Rtsp):\/\/)/;
            return message.replace(url, function ($1) {
                goUrl = $1;
                fetchDataUrl = $1;
                if (!startWith.test(goUrl)) {
                    fetchDataUrl = "http://" + goUrl;
                    goUrl = "//" + goUrl;
                }
                let a = document.createElement("a");
                let linkText = document.createTextNode($1);
                a.appendChild(linkText);
                a.title = $1;
                a.href = goUrl;
                a.target = "_blank";
                a.setAttribute("data-url-fetch", fetchDataUrl);
                a.classList.add("chat__text--link");
                a.classList.add("msg__link--" + id);
                a.classList.add("mr-1");
                return a.outerHTML;
            });
        },
    },
};
</script>
<style lang="scss">
.wp-chat-item {
    position: relative;
}
.msg-time-left {
    padding-left: 50px;
}
.plyr--audio .plyr__controls {
    background: var(--bs-dark) !important;
    .plyr__control {
        color: #fff !important;
        span {
            color: #3e4042 !important;
        }
    }
    .plyr__controls__item {
        color: #fff !important;
    }
    .plyr__control--forward {
        color: #3e4042 !important;
    }
}
.message__audio {
    flex: 1;
    max-width: 503px;
    border-radius: 25px !important;
    background: transparent !important;
    .plyr--audio {
        border-radius: inherit;
    }
}
.message__image {
    max-width: 250px;
    max-height: 250px;
    &--item {
        flex: 0 0 125.31px;
        max-width: 125.31px;
        height: 125.31px;
        max-height: 125.31px;
        margin-bottom: 5px;
        margin-right: 5px;
        a {
            display: block;
            height: 100%;
        }
    }
}
.message__actions {
    &--reaction {
        position: relative;
    }
}
.message__image.images {
    max-width: 400px !important;
    width: 400px !important;
    max-height: 100% !important;
}
.message__actions .text-muted {
    font-size: 12.99999px;
}
.msg-time-right {
    padding-right: 56px;
}
.text-chat .chat__text--link {
    color: #fff !important;
    font-weight: 600;
    text-decoration: underline;
}

.message__type {
    &--image {
        height: 20% !important;
        width: 18%;
        background: none !important;
        img {
            border-radius: inherit;
        }
    }
}
.info__website {
    width: 300px;
    background: #b0b3b8;
}
.chat-item {
    border-radius: 18px !important;
    font-size: 15px;
    line-height: 20.1px;
    padding: 8px 12px;
}

.friend-chat .name-sender {
    color: #b0b3b8;
}
.me-chat .name-sender {
    color: #00b2ff;
    font-weight: 600;
}
.friend-chat {
    background: #3e4042 !important;
}
.me-chat {
    background: #006aff !important;
}
</style>
