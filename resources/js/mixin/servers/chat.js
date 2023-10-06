export default {
    data() {
        return {
            blockSroll: false,
            channelChat: null,
            chatting: false,
        };
    },
    methods: {
        goCallRoom(url = "") {
            if (this.isMobile || !this.isIpadProUp) {
                return this.$router.push(url);
            }
            return this.popupCenter(url, "Cuộc hội thoại của dav-chat");
        },
        deleteSavedScroll() {
            localStorage.setItem("saveScrollHeight", 0);
        },
        scrollEnd(
            foc = false,
            deleteSavedScroll = false,
            limitScrollBlock = 300,
            returnBackIfNot = false
        ) {
            if (deleteSavedScroll) {
                this.deleteSavedScroll();
            }
            const el = document.getElementById("chatLayout");
            const saveScrollHeight = localStorage.getItem("saveScrollHeight");
            if (el) {
                let scroll = el.scrollHeight;
                let sum = Number(scroll - saveScrollHeight);
                if (
                    !this.isPointBlockScroll(
                        limitScrollBlock,
                        returnBackIfNot
                    ) ||
                    foc
                ) {
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
            Echo.join(`chat-${idReceiver}`).listen("SendMessage", async (e) => {
                const authId = Number(this.$store.getters["auth/id"]);
                if (
                    e.user_message.type_msg == 5 &&
                    e.user_message.sd_id == authId
                ) {
                    await this.$store.commit(
                        "message/pushMessage",
                        e.user_message
                    );
                    this.scrollEnd(true);
                }
            });
            ////////////////////////////////////////////////////////////////////////////////////////
        },
        myChannelChat() {
            Echo.private(`chat-${this.authId}`).listenForWhisper(
                "typing",
                async (e) => {
                    if (
                        this.$store.getters["message/receiver"] &&
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

            Echo.join(`chat-${this.authId}`)
                .here((users) => {
                    this.$store.dispatch("users/getUsersMyRoom", users);
                })
                .joining((user) => {
                    this.$store.dispatch("users/pushMyRoom", user);
                    this.$store.commit("message/joinChat", user.id);
                })
                .leaving((user) => {
                    this.$store.commit("users/deleteUserMyRoom", user);
                    this.$store.commit("message/leavingChat", user.id);
                })
                // ANCHOR xử lý tin nhắn đã gửi đến người nhậN //////////////////////////////////////////////////////
                .listen("SendMessage", async (e) => {
                    console.log(e);
                    await this.$store.dispatch("message/getTyping", false);
                    await this.$store.commit("message/setActiveReply", null);
                    const authId = Number(this.$store.getters["auth/id"]);
                    const rcvId = this.isChat
                        ? Number(this.$store.getters["message/receiver"].id)
                        : 0;

                    const userMessage = e.user_message;

                    if (userMessage.seen === 0) {
                        console.log("ok");
                        this.$store.commit("users/updateUnseen", {
                            type: "increase",
                            userId: parseInt(userMessage.sd_id),
                        });
                    }
                    if (
                        Number(userMessage.rcv_id) == authId ||
                        userMessage.call_info
                    ) {
                        this.chatting = true;
                        const blocking = this.isPointBlockScroll();
                        if (blocking) {
                            this.$store.commit("message/setBlockLoadImg", true);
                        } else {
                            this.$store.commit(
                                "message/setBlockLoadImg",
                                false
                            );
                        }
                        this.$store.dispatch("message/getMessage", userMessage);

                        if (rcvId == Number(userMessage.sd_id)) {
                            this.$store.dispatch("message/getIsChatting", true);
                            if (!blocking) {
                                this.scrollEnd(true);
                            }
                        }
                        const tone = this.$refs.msgTone;
                        tone.play();
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
