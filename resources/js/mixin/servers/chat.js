import { toInteger } from "lodash";

export default {
    methods: {
        scrollEnd(foc = false) {
            const el = document.getElementById("chatLayout");
            const saveScrollHeight = localStorage.getItem("saveScrollHeight");
            if (el) {
                let scroll = el.scrollHeight;
                let sum = Number(scroll - saveScrollHeight);
                if (!this.blockSroll || foc) {
                    return el.scrollTo({
                        top: sum,
                        behavior: "smooth",
                    });
                }
            }
        },
        isPointBlockScroll(minus = 100, returnBack = false) {
            const elLayoutChat = document.getElementById("chatLayout");
            if (!elLayoutChat) {
                return false;
            }
            const scrollTop = elLayoutChat.scrollTop;
            const height = elLayoutChat.clientHeight;
            const scroll = elLayoutChat.scrollHeight;
            const sum = Number(scrollTop + height);
            const pointShowBtn = Number(scroll - minus);
            if (sum <= pointShowBtn) {
                return true;
            }
            return returnBack;
        },
        serverGroup(idReceiver) {
            Echo.join(`group-chat-${idReceiver}`)
                .here((users) => {
                    console.log(users);
                })
                .joining((user) => {})
                .leaving((user) => {})
                .listen("SendMessageGroup", (e) => {
                    this.$store.dispatch("message/getMessage", e.user_message);
                })
                .listen("HandleRequest", (e) => {
                    if (e.data.action == "joinGr") {
                        this.$store.dispatch(
                            "users/getDataHandleRequest",
                            e.data
                        );
                    }
                    if (e.data.group_action == "reqActions") {
                        this.$store.dispatch("message/handleActions", e.data, {
                            root: true,
                        });
                    }
                    if (e.data.group_action == "reqSaveData") {
                        this.$store.dispatch(
                            "users/getDataGroupSave",
                            e.data.newestGr
                        );
                    }
                });
        },
        server(idReceiver) {
            Echo.join(`chat-${idReceiver}`);
            ////////////////////////////////////////////////////////////////////////////////////////
        },
        async myServer() {
            await Echo.private(`chat-${this.id}`).listenForWhisper(
                "typing",
                (e) => {
                    console.log(e);
                    this.$store.dispatch("message/getTyping", e.typing);
                }
            );
            await Echo.join(`notify-${this.id}`)
                .here((users) => {
                    console.log(users);
                })
                .listen("SenRqJoinGr", (e) => {
                    console.log(e);
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
                            if (e.data.users_id == this.id) {
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
                });
            await Echo.join(`chat-${this.id}`)
                .here((users) => {
                    console.log(users);
                    this.$store.dispatch("users/getUsersMyRoom", users);
                })
                .joining((user) => {
                    this.$store.dispatch("users/pushMyRoom", user);
                })
                .leaving((user) => {
                    this.$store.commit("users/deleteUserMyRoom", user);
                })
                .listen("SendMessage", (e) => {
                    this.$store.dispatch("message/getTyping", false);
                    if (e.user_message.seen == 0) {
                        let el = document.getElementById(
                            "queue-" + e.user_message.sd_id
                        );
                        let countQueue =
                            Number(el.getAttribute("data-count")) + 1;
                        el.setAttribute("data-count", countQueue);
                        el.innerHTML = countQueue;
                        if (countQueue == 1) {
                            el.style.display = "";
                        }
                    }
                    this.$store.dispatch("message/getMessage", e.user_message);
                    this.isPointBlockScroll(100, this.scrollEnd(true));
                });
        },
        async updateSeen(friendId) {
            await this.$store.dispatch("message/updateSeen", {
                receiver: friendId,
            });
        },
    },
};
