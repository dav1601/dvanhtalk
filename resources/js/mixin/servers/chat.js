export default {
    data() {
        return {
            blockSroll: false,
        };
    },
    methods: {
        scrollEnd(
            foc = false,
            deleteSavedScroll = false,
            limit = 300,
            returnBackForNot = false
        ) {
            const el = document.getElementById("chatLayout");
            if (deleteSavedScroll) {
                localStorage.setItem("saveScrollHeight", 0);
            }
            const saveScrollHeight = localStorage.getItem("saveScrollHeight");
            if (el) {
                let scroll = el.scrollHeight;
                let sum = Number(scroll - saveScrollHeight);
                if (!this.isPointBlockScroll(limit, returnBackForNot) || foc) {
                    el.scrollTo({
                        top: sum,
                    });
                }
            }
        },
        isPointBlockScroll(limit = 300, returnBackForNot = false) {
            const elLayoutChat = document.getElementById("chatLayout");
            if (!elLayoutChat) {
                return false;
            }
            const scrollTop = elLayoutChat.scrollTop;
            const height = elLayoutChat.clientHeight;
            const scroll = elLayoutChat.scrollHeight;
            const sum = Number(scrollTop + height);
            const poinBlockScroll = Number(scroll - limit);
            if (sum <= poinBlockScroll) {
                return true;
            }
            return returnBackForNot;
        },
        serverGroup(idReceiver) {
            Echo.join(`group-chat-${idReceiver}`)
                .here((users) => {})
                .joining((user) => {})
                .leaving((user) => {})
                .listen("SendMessageGroup", (e) => {
                    this.$store.dispatch("message/getMessage", e.user_message);
                    this.scrollEnd();
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
                })
                .listen("CustomEvent", (e) => {
                    if (e.event == "reaction.message") {
                        this.$store.commit("message/updateMessage", e.data);
                        this.$store.dispatch(
                            "message/getReactionMsg",
                            e.data.message.message.reaction
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
                async (e) => {
                    if (
                        this.$store.getters["message/receiver"].id ==
                        e.sender_id
                    ) {
                        await this.$store.dispatch(
                            "message/getTyping",
                            e.typing
                        );
                        this.scrollEnd(false, false, 100, false);
                    }
                }
            );
            await Echo.join(`notify-${this.id}`)
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
                    this.$store.dispatch("users/getUsersMyRoom", users);
                })
                .joining((user) => {
                    this.$store.dispatch("users/pushMyRoom", user);
                })
                .leaving((user) => {
                    this.$store.commit("users/deleteUserMyRoom", user);
                })
                .listen("SendMessage", async (e) => {
                    await this.$store.dispatch("message/getTyping", false);
                    if (e.user_message.seen == 0) {
                        let el = document.getElementById(
                            "queue-" + e.user_message.sd_id
                        );
                        let plus = 1;
                        if (e.user_message.message_images) {
                            plus = 2;
                        }
                        let countQueue =
                            Number(el.getAttribute("data-count")) + plus;
                        el.setAttribute("data-count", countQueue);
                        el.innerHTML = countQueue;
                        if (countQueue > 0) {
                            el.style.display = "";
                        }
                    }
                    if (
                        Number(e.user_message.rcv_id) ==
                        Number(this.$store.getters["auth/id"])
                    ) {
                        this.$store.dispatch(
                            "message/getMessage",
                            e.user_message
                        );
                        if (
                            Number(
                                this.$store.getters["message/receiver"].id
                            ) == Number(e.user_message.sd_id)
                        ) {
                            this.$store.dispatch("message/getIsChatting", true);
                            this.scrollEnd();
                        }
                    }
                })
                .listen("CustomEvent", (e) => {
                    if (e.event == "reaction.message") {
                        this.$store.commit("message/updateMessage", e.data);
                        this.$store.dispatch(
                            "message/getReactionMsg",
                            e.data.message.message.reaction
                        );
                    }
                });
        },
        async updateSeen(friendId) {
            await this.$store.dispatch("message/updateSeen", {
                receiver: friendId,
            });
        },
    },
};
