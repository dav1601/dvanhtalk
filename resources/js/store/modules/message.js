import Vue from "vue";
const state = () => ({
    messages: [],
    messageReply: null,
    messengerMedia: [],
    receiver: {},
    haveReceiver: false,
    typing: false,
    isChatting: false,
    rootReaction: null,
    allReaction: null,
    groupReaction: null,
    dialogReaction: false,
    typeChat: null,
    calling: false,
    incomingCall: false,
    rcvInRoom: false,
    blockLoadImg: false,
    activeReply: null,
    inCall: false,
    emojiPickerMsg: null,
    vidPlaying: null,
    auPlaying: null,
    activeAction: null,
    errorMessages: null,
    errorReceiver: null,
});

const getters = {
    activeAction(s) {
        return s.activeAction;
    },
    vidPlaying(s) {
        return s.vidPlaying;
    },
    auPlaying(s) {
        return s.auPlaying;
    },
    progressImg(s) {
        return s.progressImg;
    },
    emojiPickerMsg(s) {
        return s.emojiPickerMsg;
    },
    inCall(s) {
        return s.inCall;
    },
    rcvInRoom(s) {
        return s.rcvInRoom;
    },
    incomingCall(s) {
        return s.incomingCall;
    },
    blockLoadImg(s) {
        return s.blockLoadImg;
    },
    calling(s) {
        return s.calling;
    },
    activeReply(s) {
        return s.activeReply;
    },
    messages(s) {
        return s.messages;
    },
    messengerMedia(s) {
        return s.messengerMedia;
    },
    receiver: (s) => s.receiver,
    haveReceiver(s) {
        return s.haveReceiver;
    },
    isTyping(s) {
        return s.typing;
    },
    isChatting(s) {
        return s.isChatting;
    },
    messageReply(s) {
        return s.messageReply;
    },
    allReaction(s) {
        return s.allReaction;
    },
    groupReaction(s) {
        return s.groupReaction;
    },
    dialogReaction(s) {
        return s.dialogReaction;
    },
    amountReaction(s) {
        if (s.rootReaction != null) {
            return s.rootReaction.length;
        }
    },
    rootReaction(s) {
        return s.rootReaction;
    },
    typeChat(s) {
        return s.typeChat;
    },
    notifyCall(s) {
        return s.notifyCall;
    },
    errorApi(s) {
        return isEmpty(s.errorApi);
    },
};

const mutations = {
    setActiveAction(s, p) {
        return (s.activeAction = p);
    },
    setVid(s, p) {
        return (s.vidPlaying = p);
    },
    setAu(s, p) {
        return (s.auPlaying = p);
    },
    setEmojiPicker(s, p) {
        s.emojiPickerMsg = p;
    },
    setProgressImg(s, p) {
        return (s.progressImg = p);
    },
    leavingChat(s, p) {
        if (s.receiver && s.receiver.id == p) {
            return (s.rcvInRoom = false);
        }
        return;
    },
    joinChat(s, p) {
        if (s.receiver && s.receiver.id == p) {
            return (s.rcvInRoom = true);
        }
        return;
    },
    setIncomingCall(s, p) {
        return (s.incomingCall = p);
    },
    setCalling(s, p) {
        return (s.calling = p);
    },
    setActiveReply(s, p) {
        s.activeReply = p;
    },

    pushMedia(s, p) {
        const arrayMedia = p.message.split(",");
        arrayMedia.forEach((el, index) => {
            let data = {
                alt: "gll",
                index: index,
                msg_id: p.id,
                url: el,
            };
            s.messengerMedia.push(data);
        });
    },
    setBlockLoadImg(s, p) {
        return (s.blockLoadImg = p);
    },
    setInRoom(s, p) {
        if (s.receiver.hasOwnProperty("id")) {
            const isRcv = p.findIndex((user) => {
                return user.id == s.receiver.id;
            });
            if (isRcv != -1) {
                s.rcvInRoom = true;
            } else {
                s.rcvInRoom = false;
            }
        } else {
            s.rcvInRoom = false;
        }
    },
    setTypeChat(s, p) {
        return (s.typeChat = p);
    },
    setNotifyCall(s, p) {
        return (s.notifyCall = p);
    },
    resetReaction(s) {
        s.rootReaction = null;
        s.allReaction = null;
        s.groupReaction = null;
        s.dialogReaction = false;
    },
    reset(s) {
        s.messages = [];
        s.messageReply = null;
        s.messengerMedia = [];
        s.receiver = {};
        s.haveReceiver = false;
        s.typing = false;
        s.isChatting = false;
        s.rootReaction = null;
        s.allReaction = null;
        s.groupReaction = null;
        s.dialogReaction = false;
        s.typeChat = null;
        s.rcvInRoom = false;
        s.blockLoadImg = false;
        s.activeReply = null;
        s.emojiPickerMsg = null;
        s.vidPlaying = null;
        s.auPlaying = null;
        s.activeAction = null;
        s.errorMessages = null;
        s.errorReceiver = null;
    },
    actionDialogReaction(s, p) {
        if (p == "open") {
            s.dialogReaction = true;
        } else {
            s.dialogReaction = false;
        }
    },
    async updateMessage(s, p) {
        const index = s.messages.findIndex((msgs) => {
            return msgs.created_at == p.created_at;
        });
        if (index != -1) {
            const indexMessage = s.messages[index].messages.findIndex((msg) => {
                return msg.msg_id == p.message.msg_id;
            });

            if (indexMessage != -1) {
                await Vue.set(
                    s.messages[index].messages,
                    indexMessage,
                    p.message
                );
            }
        }
    },
    updateSeenAllMessage(s, p) {
        if (p.id == s.receiver.id && p) {
            s.messages.forEach((element) => {
                element.messages.map((item) => {
                    return (item.seen = 1);
                });
            });
        }
    },
    async updateReaction(s, p) {
        if (allReaction == null || groupReaction == null) {
            return;
        }
        this.commit("setReactionDialog", p);
    },
    updateAllReaction(s, p) {
        s.allReaction = p;
    },
    setReactionDialog(s, p) {
        s.rootReaction = p;
        s.allReaction = p;
        const groupReaction = s.rootReaction.reduce((reaction, icon) => {
            const group = reaction[icon.reaction] || [];
            group.push(icon);
            reaction[icon.reaction] = group;
            return reaction;
        }, {});
        s.groupReaction = groupReaction;
    },
    deleteMsgReply(s) {
        return (s.messageReply = null);
    },
    setMessageReply(s, p) {
        s.messageReply = p;
    },
    setTyping(s, p) {
        s.typing = p;
    },
    setIsChatting(s, p) {
        s.isChatting = p;
    },
    setUnseenMessage(s, p) {
        return (s.unSeenMessage.id = p);
    },
    setMessages(s, p) {
        return (s.messages = p.data);
    },
    setMessemgerMedia(s, p) {
        s.messengerMedia = p;
    },
    setReceiver(s, p) {
        s.receiver = { ...s.receiver, ...p };
    },
    async pushMessage(s, p) {
        s.typing = false;
        const index = s.messages.findIndex((el) => {
            return el.created_at == p.group_created_at;
        });
        let messages = [];
        messages.push(p);
        let data = { created_at: p.group_created_at, messages };
        if (index != -1) {
            await s.messages[index].messages.push(p);
        } else {
            await s.messages.push(data);
        }
    },
    updateMember(s, p) {
        if (s.receiver.members && p) {
            const index = s.receiver.members.findIndex((user) => {
                return user.users_id == p.id;
            });
            if (index != -1) {
                s.receiver.members[index].info = p;
            }
        }
    },
    pushMember(s, p) {
        if (s.receiver.members) {
            if (s.receiver.id == p.request.groups_id) {
                return s.receiver.members.push(p.member);
            }
        }
        return;
    },
    setHaveReceiver(s) {
        return (s.haveReceiver = true);
    },
    setInCall(s, p) {
        return (s.inCall = p);
    },
    setErrorMessages(s, p) {
        return (s.errorMessages = p);
    },
    setErrorReceiver(s, p) {
        return (s.errorReceiver = p);
    },
};

const actions = {
    getReactionMsg(c, p) {
        c.commit("setReactionDialog", p);
    },
    getDataReaction(c, p) {
        if (c.rootGetters["auth/id"] == p.rcv_id) {
            c.commit("updateMessage", p);
        }
    },
    getMessageReply(c, p) {
        c.commit("setMessageReply", p);
    },
    handleActions(c, p) {
        c.commit("setReceiver", p.newestGr);
    },
    getTyping(c, p) {
        c.commit("setTyping", p);
    },
    getIsChatting(c, p) {
        c.commit("setIsChatting", p);
    },
    reset(c) {
        c.commit("reset");
    },
    getReceiver(c, p) {
        let errKey = "Receiver";
        c.commit("app/rsErrApi", errKey, { root: true });
        return new Promise((rs, rj) => {
            axios
                .get(route("get.receiver", [p.contactId]), {
                    params: { type: p.type },
                })
                .then((req) => {
                    c.commit("setReceiver", req.data.receiver);
                    c.commit("setHaveReceiver");
                    rs(req);
                })
                .catch((err) => {
                    c.commit(
                        "app/addErrApi",
                        {
                            type: errKey,
                            text: err.response.statusText,
                        },
                        { root: true }
                    );
                    rj(err.response);
                });
        });
    },
    getMessengerMedia(c, p) {
        return new Promise((rs, rj) => {
            axios
                .get(
                    route("messages.media", {
                        thread_id: p.receiverId,
                        attachment_id: p.index,
                        message_id: p.msgId,
                        type: p.type,
                    })
                )
                .then((req) => {
                    c.commit("setMessemgerMedia", req.data);
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    getMessages(c, p) {
        let _query = {
            page: p.page,
        };
        if (p.msgId) {
            _query["msg_id"] = p.msgId;
        }
        return new Promise((rs, rj) => {
            axios
                .get(
                    route("messages.index", {
                        conversationId: p.conversationId,
                        type: p.type,
                        _query: _query,
                    })
                )
                .then((req) => {
                    const data = req.data.data;
                    c.commit("setMessages", {
                        data: data,
                        type: p.type,
                    });
                    c.commit("setMessemgerMedia", req.data.messenger_media);
                    rs(req);
                })
                .catch((err) => {
                    c.commit("setErrorMessages", err.response.statusText);
                    rj(err);
                });
        });
    },
    async getMessage(c, p) {
        await c.commit("users/updateLastMessage", p, { root: true });
        if (p.type == 0) {
            if (c.rootGetters["auth/id"] == p.rcv_id) {
                if (c.getters.receiver.id == p.sd_id) {
                    await c.commit("pushMessage", p);
                    if (p.type_msg == 2 || p.type_msg == 7) {
                        await c.commit("pushMedia", p.message);
                    }
                } else {
                    await c.commit("users/updatePosUsers", p.sd_id, {
                        root: true,
                    });
                }
            } else {
                return;
            }
        } else {
            await c.commit("pushMessage", p);
            if (p.message_images) {
                await c.commit("pushMessage", p.message_images);
            }
        }
    },
    updateSeen(c, p) {
        return new Promise((rs, rj) => {
            axios;

            axios
                .post("/update_seen", {
                    receiver: p.receiver,
                })
                .then((req) => {})
                .catch((err) => {});
        });
    },

    sendMessage(c, p) {
        let data = new FormData();
        const parent_id = p.messageReply ? p.messageReply.msg_id : null;
        data.append("to", p.to);
        data.append("seen", p.seen);
        data.append("parent_id", parent_id);
        data.append("for", c.getters["typeChat"]);
        data.append("type_msg", p.typeMsg);
        data.append("message", p.message);
        return new Promise((rs, rj) => {
            axios
                .post(route("messages.store"), data)
                .then(async (req) => {
                    const data = req.data.payload;
                    console.log(data);
                    await c.commit("pushMessage", data);
                    if (data.type_msg == 2 || data.type_msg == 7) {
                        await c.commit("pushMedia", data.message.message);
                    }
                    await c.commit("users/updateLastMessage", data, {
                        root: true,
                    });

                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    createMessageCall(c, p) {
        const data = new FormData();
        data.append("duration", p.duration);
        data.append("receiverId", p.receiver);
        data.append("status", p.status);
        data.append("process", p.process);
        data.append("for", p.for);
        data.append("hasVideo", p.hasVideo);
        return new Promise((rs, rj) => {
            axios
                .post(route("messages.store.call"), data)
                .then((req) => {
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    saveReaction(c, p) {
        const data = new FormData();
        data.append("type", c.getters["typeChat"]);
        data.append("rcvId", c.getters["receiver"].id);
        if (p.reaction) {
            data.append("reaction", p.reaction);
        }
        data.append("msgId", p.msgId);
        data.append("action", p.actions);
        return new Promise((rs, rj) => {
            axios
                .post(route("messages.store.reaction"), data)
                .then((req) => {
                    c.commit("updateMessage", req.data);
                    c.commit(
                        "setReactionDialog",
                        req.data.message.message.reaction
                    );
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    removeReaction(c, p) {
        const data = new FormData();
        data.append("type", p.type);
        data.append("rcvId", p.rcvId);
        data.append("msgId", p.msgId);
        data.append("action", "delete");
        return new Promise((rs, rj) => {
            axios
                .post(route("messages.delete.reaction"), data)
                .then((req) => {
                    // c.commit("setReactionDialog", req.data);
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    createRoomCall(c, p) {
        const data = new FormData();
        data.append("to", Number(p));
        return new Promise((rs, rj) => {
            axios
                .post(route("message.create.room.call"), data)
                .then((req) => {
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    sendMessageToPeer() {},
    offerCall(c, p) {
        const data = new FormData();
        data.append("to", Number(p.receiver));
        data.append("type", p.type);
        data.append("action", p.action);
        data.append("urlJoin", p.urlJoin);
        data.append("singalCaller", p.singalCaller);
        return new Promise((rs, rj) => {
            axios
                .post(route("call.offer"), data)
                .then((req) => {
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};
