const state = () => ({
    messages: [],
    messageReply: null,
    messengerMedia: [],
    receiver: null,
    haveReceiver: false,
    typing: false,
    isChatting: false,
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
};

const mutations = {
    reset(s) {
        s.messages = [];
        s.messengerMedia = [];
        s.receiver = null;
        s.haveReceiver = false;
        s.typing = false;
        s.isChatting = false;
        s.messageReply = null;
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
        const index = s.messages.findIndex((el) => {
            return el.created_at == p.created_at;
        });
        let messages = [];
        messages.push(p);
        let data = { created_at: p.created_at, messages };
        if (index != -1) {
            await s.messages[index].messages.push(p);
        } else {
            await s.messages.push(data);
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
                    c.commit("setMessemgerMedia", req.data.messenger_media);
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    getMessage(c, p) {
        if (p.type == 0) {
            if (
                c.rootGetters["auth/id"] == p.rcv_id &&
                c.getters.receiver.id == p.sd_id
            ) {
                c.commit("pushMessage", p);
                if (p.message_images) {
                    c.commit("pushMessage", p.message_images);
                }
                c.commit("users/updateLastMessage", p, { root: true });
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
        data.append("from", p.from);
        data.append("message", p.msg);
        data.append("parent_id", p.parent_id);
        data.append("seen", p.seen);
        data.append("type", p.type);
        for (let index = 0; index < p.images.length; index++) {
            data.append("images[" + index + "]", p.images[index]);
        }
        data.append("audio", p.audio);
        data.append("for", p.for);
        return new Promise((rs, rj) => {
            axios
                .post("/saveMessage", data, config)
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
};

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};
