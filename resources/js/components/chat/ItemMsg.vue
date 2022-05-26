<template>
    <div>
        <div
            class="pb-4"
            v-if="data.message.type != 4"
            :class="[itMe ? ['chat-message-right'] : ['chat-message-left']]"
        >
            <div class="d-flex flex-column align-items-center">
                <img
                    :src="itMe ? avatar : makeAvatar(receiver.avatar)"
                    class="rounded-circle mr-1"
                    :alt="receiver.name"
                    width="45"
                    height="45"
                />
                <div
                    class="text-muted text-nowrap mt-2"
                    :class="[itMe ? [''] : ['mx-2']]"
                >
                    {{ formatTime(data.message.created_at) }}
                </div>
            </div>

            <div
                class="flex-shrink-1 bg-light rounded px-3 py-2 mr-2 chat-item d-flex flex-column position-relative"
                :class="[renderClass, isGroup ? ['royal-role-' + role] : '']"
                v-if="type == 1"
            >
                <div v-if="!isGroup" class="font-weight-bold mb-1 name-sender">
                    {{ itMe ? "You" : receiver.name }}
                </div>
                <div
                    v-if="isGroup"
                    class="font-weight-bold mb-1 name-sender d-flex justify-center-start align-items-center"
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
                    ref="myMsgText"
                    v-html="
                        replaceURLWithHTMLLinks(
                            data.message.message,
                            data.message.id
                        )
                    "
                ></div>
            </div>
            <div
                class="flex-shrink-1 bg-light rounded px-2 py-2 mr-3"
                :style="createBackgroundImage"
                v-if="type == 2"
            >
                <img
                    :src="data.message.message"
                    alt="message image"
                    @load="loaded"
                />
            </div>
            <div
                :style="createBgAudio"
                class="flex-shrink-1 bg-light rounded px-1 py-1 mr-3"
                v-if="type == 3"
            >
                <vuetify-audio
                    :file="data.message.message"
                    color="primary"
                    downloadable
                    :canPlay="loaded"
                ></vuetify-audio>
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
export default {
    props: ["data", "receiver", "typeUserMsg"],
    mixins: [user],
    components: {
        VuetifyAudio: () => import("vuetify-audio"),
        TheRole,
    },
    mounted() {},
    computed: {
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
            return this.getUser.role;
        },
    },
    methods: {
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
        replaceURLWithHTMLLinks(message, id) {
            let urls,
                lastURL,
                checkURL = "",
                output = "";
            let url = /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
            let startWith = /^((http|https|ftp):\/\/)/;
            while ((urls = url.exec(message)) !== null) {
                output += urls[0];
            }
            if (!startWith.test(output)) {
                output = "//" + output;
            }
            if (message != "" && message != null) {
                return message.replace(
                    url,
                    `<a href="${output}" target="_blank" class="chat__text--link chat__link--${id}">
                        $1
                    </a>`
                );
            }
        },
    },
};
</script>
<style>
.msg-time-left {
    padding-left: 50px;
}
.text-muted {
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
img {
    max-width: 350px;
    max-height: 350px;
}
.chat-item {
    border-radius: 8px !important;
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
