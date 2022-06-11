<template>
    <div class="package__msg">
        <div
            class="pb-4"
            v-if="data.message.type != 4"
            :class="[itMe ? ['chat-message-right'] : ['chat-message-left']]"
        >
            <div
                class="d-flex flex-column align-items-center justify-content-end"
            >
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
                :class="[
                    renderClass,
                    isGroup ? ['royal-role-' + role] : '',
                    ['msg-' + data.message.id],
                ]"
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
                    v-html="MakeMessage(data.message.message, data.message.id)"
                ></div>
                <!-- <a href="" v-if="metaData && !isGroup" class="in4__website">
                    <img
                        :src="
                            metaData.images.length > 0
                                ? metaData.images[0]
                                : 'https://occ-0-116-114.1.nflxso.net/dnm/api/v6/U6_eu_lw5TPOkLCYXBHQsUANDp0/AAAABWiz2QNaiC4pMM8J-uWx6IgnT_1SJrbbdRycS0kRYaH-i1yiIg_ew7wZHuKZ0AfrRSK1PSh9.png'
                        "
                        width="300"
                        height="auto"
                        alt=""
                        @load="loaded"
                    />
                    <span class="px-3 py-4">
                        {{ metaData.title ? metaData.title : metaData.domain }}
                    </span>
                </a> -->
            </div>

            <div
                class="message__image"
                v-if="data.message.type == 2"
                :class="[itMe ? ['mr-2'] : ['ml-2'], images ? ['images'] : '']"
            >
                <router-link
                    v-if="!images"
                    :to="{
                        name: 'messengerMedia',
                        query: {
                            thread_id: receiver.id,
                            message_id: encryptedId,
                            attachment_id: 0,
                            type: 0,
                        },
                    }"
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
                </router-link>
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
                        class="message__image--item"
                    >
                        <router-link
                            :to="{
                                name: 'messengerMedia',
                                query: {
                                    thread_id: receiver.id,
                                    message_id: encryptedId,
                                    attachment_id: index,
                                    type: 0,
                                },
                            }"
                        >
                            <img
                                @load="loaded"
                                :src="image"
                                width="100%"
                                height="100%"
                                style="border-radius: 8px"
                                class="img__obj--cover"
                            />
                        </router-link>
                    </div>
                </div>
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
    props: ["data", "receiver", "typeUserMsg", "cOrW"],
    mixins: [user],
    components: {
        VuetifyAudio: () => import("vuetify-audio"),
        TheRole,
    },
    data() {
        return {
            interval: null,
            metaData: false,
            arrayFetch: [],
            arrayImage: [],
        };
    },
    created() {
        if (this.data.type_msg == 2) {
            this.arrayImage = this.data.message.message.split(",");
        }
        this.created_at = this.data.message.created_at;
    },
    async mounted() {
        // this.interval = setInterval(() => this.$forceUpdate(), 1000);
        // if (!this.isGroup) {
        //     await this.setHaveLink;
        // }
    },

    computed: {
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
            // let url = /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
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
.msg-time-left {
    padding-left: 50px;
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
.message__image.images {
    max-width: 400px !important;
    width: 400px !important;
    max-height: 100% !important;
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
