import Vue from "vue";
const state = () => ({
    messages: [],
    messageReply: null,
    messengerMedia: [],
    receiver: null,
    haveReceiver: false,
    typing: false,
    isChatting: false,
    rootReaction: null,
    allReaction: null,
    groupReaction: null,
    dialogReaction: false,
    typeChat: 0,
});

const getters = {
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
};

const mutations = {
    setTypeChat(s, p) {
        return (s.typeChat = p);
    },
    resetReaction(s) {
        s.rootReaction = null;
        s.allReaction = null;
        s.groupReaction = null;
        s.dialogReaction = false;
    },
    reset(s) {
        s.messages = [];
        s.messengerMedia = [];
        s.receiver = null;
        s.haveReceiver = false;
        s.typing = false;
        s.isChatting = false;
        s.messageReply = null;
        s.rootReaction = null;
        s.allReaction = null;
        s.groupReaction = null;
        s.dialogReaction = false;
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
            console.log(indexMessage);
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
                    rj(err);
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
        return new Promise((rs, rj) => {
            axios
                .get(
                    route("messages.index", {
                        conversationId: p.conversationId,
                        type: p.type,
                        _query: {
                            page: p.page,
                        },
                    })
                )
                .then((req) => {
                    const data = req.data.data;
                    c.commit("setMessages", {
                        data: data,
                        type: p.type,
                    });
                    if (p.page == 1) {
                        c.commit("setMessemgerMedia", req.data.messenger_media);
                    }
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    getMessage(c, p) {
        c.commit("users/updateLastMessage", p, { root: true });
        if (p.type == 0) {
            if (c.rootGetters["auth/id"] == p.rcv_id) {
                if (c.getters.receiver.id == p.sd_id) {
                    c.commit("pushMessage", p);
                    if (p.message_images) {
                        c.commit("pushMessage", p.message_images);
                    }
                } else {
                    c.commit("users/updatePosUsers", p.sd_id, { root: true });
                }
            } else {
                return;
            }
        } else {
            c.commit("pushMessage", p);
            if (p.message_images) {
                c.commit("pushMessage", p.message_images);
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
        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };
        let data = new FormData();
        data.append("to", p.to);
        data.append("message", p.msg);
        if (p.messageReply == null) {
            data.append("parent_id", null);
        } else {
            data.append("parent_id", p.messageReply.msg_id);
        }

        data.append("seen", p.seen);
        data.append("type", p.type);
        for (let index = 0; index < p.images.length; index++) {
            data.append("images[" + index + "]", p.images[index]);
        }
        data.append("audio", p.audio);
        data.append("for", c.getters["typeChat"]);
        return new Promise((rs, rj) => {
            axios
                .post(route("messages.store"), data, config)
                .then((req) => {
                    let data = req.data.data;
                    c.commit("pushMessage", data);
                    if (data.message_images) {
                        c.commit("pushMessage", data.message_images);
                    }
                    c.commit("users/updateLastMessage", data, {
                        root: true,
                    });
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
                    console.log(req);
                    // c.commit("setReactionDialog", req.data);
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
