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
                });
        },
        server(idReceiver) {
            Echo.join(`chat-${idReceiver}`);
            ////////////////////////////////////////////////////////////////////////////////////////
            Echo.join(`chat-${this.id}`)
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
                });
        },
        async updateSeen(friendId) {
            await this.$store.dispatch("message/updateSeen", {
                receiver: friendId,
            });
        },
    },
};
