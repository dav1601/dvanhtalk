const state = () => ({
    messages: [],
    receiver: {},
    haveReceiver: false,
    typing: false,
});

const getters = {
    messages(s) {
        return s.messages;
    },
    receiver: (s) => s.receiver,
    haveReceiver(s) {
        return s.haveReceiver;
    },
    meIsAdminGroup(s, gts, rS, rGts) {
        return !!(
            s.receiver &&
            s.receiver.founder.id &&
            s.receiver.founder.id == rGts["auth/id"]
        );
    },
    isTyping(s) {
        return s.typing;
    },
};

const mutations = {
    reset(s) {
        (s.messages = []),
            (s.receiver = {}),
            (s.haveReceiver = false),
            (s.typing = false);
    },
    setTyping(s, p) {
        s.typing = p;
    },
    setUnseenMessage(s, p) {
        return (s.unSeenMessage.id = p);
    },
    setMessages(s, p) {
        return (s.messages = p);
    },
    setReceiver(s, p) {
        s.receiver = { ...s.receiver, ...p };
    },
    pushMessage(s, p) {
        return s.messages.push(p);
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
    handleActions(c, p) {
        c.commit("setReceiver", p.newestGr);
    },
    getTyping(c, p) {
        console.log(p);
        c.commit("setTyping", p);
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
                    c.commit("setReceiver", req.data);
                    c.commit("setHaveReceiver");
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
                .get("/messages/" + p.to, {
                    params: { type: p.type, page: p.page },
                })
                .then((req) => {
                    const data = req.data.data;
                    const messages = [];
                    if (data != null) {
                        data.forEach((message) => {
                            messages.push(message);
                        });
                    }
                    c.commit("setMessages", messages);
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
            } else {
                return;
            }
        } else {
            c.commit("pushMessage", p);
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
        data.append("file", p.file);
        data.append("audio", p.audio);
        data.append("for", p.for);
        return new Promise((rs, rj) => {
            axios
                .post("/saveMessage", data, config)
                .then((req) => {
                    if (req.data.data.sd_id == c.rootGetters["auth/id"]) {
                        c.commit("pushMessage", req.data.data);
                    }
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