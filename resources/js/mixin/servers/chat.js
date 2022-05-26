import { toInteger } from "lodash";

export default {
    methods: {
        serverGroup(idReceiver) {
            Echo.join(`group-chat-${idReceiver}`)
                .here((users) => {
                    console.log(users);
                })
                .joining((user) => {})
                .leaving((user) => {})
                .listen("SendMessageGroup", (e) => {
                    console.log(e);
                    this.$store.dispatch("message/getMessage", e.user_message);
                })
                .listen("HandleRequest", (e) => {
                    this.$store.dispatch("users/getDataHandleRequest", e.data);
                });
        },
        server(idReceiver) {
            Echo.join(`chat-${idReceiver}`);
            ////////////////////////////////////////////////////////////////////////////////////////
        },
        async myServer() {
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
                    console.log(e);
                    this.$notify({
                        group: "request__group",
                        data: {
                            request: e.data.request,
                            nofifyFor: "user",
                            status: e.data.status,
                        },
                    });
                    this.$store.dispatch("users/getDataHandleRequest", e.data);
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
                    let scrolled = 0;
                    if (this.blockScroll) {
                        scrolled = 1;
                    }
                    this.$store.dispatch("message/getMessage", e.user_message);
                    if (scrolled == 1) {
                        this.scrollEnd(true);
                    }
                });
            Echo.private(`chat-${this.id}`).listenForWhisper("typing", (e) => {
                console.log(e);
                this.$store.dispatch("message/getTyping", e.typing);
            });
        },
        async updateSeen(friendId) {
            await this.$store.dispatch("message/updateSeen", {
                receiver: friendId,
            });
        },
    },
};
