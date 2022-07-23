export default {
    data() {
        return {
            blockSroll: false,
            channelChat: null,
            chatting: false,
        };
    },
    methods: {
        deleteSavedScroll() {
            return localStorage.setItem("saveScrollHeight", 0);
        },
        scrollEnd(
            foc = false,
            deleteSavedScroll = false,
            limit = 300,
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
                if (!this.isPointBlockScroll(limit, returnBackIfNot) || foc) {
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
                .joining((user) => {
                    // const members =
                    //     this.$store.getters["message/receiver"].members;
                    // const member = members.find((member) => {
                    //     return member.users_id == user.id;
                    // });
                    // if (member && member.role < 2) {
                    //     this.$notify({
                    //         group: "effect__group",
                    //         data: {
                    //             member: member,
                    //         },
                    //     });
                    // }
                })
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
        async myChannelChat() {
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

            await Echo.join(`chat-${this.id}`)
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
                        this.chatting = true;
                        const blocking = this.isPointBlockScroll();
                        if (blocking) {
                            await this.$store.commit(
                                "message/setBlockLoadImg",
                                true
                            );
                        } else {
                            await this.$store.commit(
                                "message/setBlockLoadImg",
                                false
                            );

                        }
                        await this.$store.dispatch(
                            "message/getMessage",
                            e.user_message
                        );

                        if (
                            Number(
                                this.$store.getters["message/receiver"].id
                            ) == Number(e.user_message.sd_id)
                        ) {
                            await this.$store.dispatch(
                                "message/getIsChatting",
                                true
                            );
                            if (!blocking) {
                                this.scrollEnd(true);
                            }
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
