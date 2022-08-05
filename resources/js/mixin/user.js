import { debounce } from "debounce";
export default {
    data() {
        return {
            isLoadingGroup: false,
            isLoadingUsers: false,
        };
    },
    computed: {
        langEmoji() {
            const i18n = {
                categories: {
                    Activity: "Hoạt động",
                    Flags: "Cờ",
                    Foods: "Thức ăn",
                    Frequently: "Bạn đã sử dụng",
                    Objects: "Đồ vật",
                    Nature: "Thiên nhiên",
                    Peoples: "Con người",
                    Symbols: "Biểu Tượng",
                    Places: "Vị trí",
                },
            };
            return i18n;
        },

        name: {
            get() {
                return this.$store.getters["auth/name"];
            },
            set(value) {
                this.$store.commit("auth/updateData", {
                    property: "name",
                    value: value,
                });
            },
        },
        phoneNumber: {
            get() {
                return this.$store.getters["auth/phoneNumber"];
            },
            set(value) {
                this.$store.commit("auth/updateData", {
                    property: "phoneNumber",
                    value: value,
                });
            },
        },
        email: {
            get() {
                return this.$store.getters["auth/email"];
            },
            set(value) {
                this.$store.commit("auth/updateData", {
                    property: "email",
                    value: value,
                });
            },
        },
        notifyCall: {
            get() {
                return this.$store.getters["message/notifyCall"];
            },
            set(value) {
                this.$store.commit("message/setNotifyCall");
            },
        },
        calling() {
            return this.$store.getters["message/calling"];
        },
        incomingCall() {
            return this.$store.getters["message/incomingCall"];
        },
        id() {
            return this.$store.getters["auth/id"];
        },
        full() {
            return this.$store.getters["auth/full"];
        },
        avatar() {
            return this.$store.getters["auth/avatar"];
        },
        isHome() {
            return this.$route.name == "home";
        },
        isGroup() {
            return this.$route.name == "group";
        },
        isLobby() {
            return this.$route.name == "home";
        },
        isChat() {
            return this.$route.name == "chat";
        },
        isCallChat() {
            return this.$route.name == "call__chat";
        },
        listUser() {
            return this.$store.getters["users/users"];
        },
        listUsersOnline() {
            const userOnline = this.$store.getters["users/usersOnline"];
            const filter = userOnline.filter((user) => {
                return user.id != this.id;
            });
            return filter;
        },
        receiver() {
            if (this.isReceiver) {
                return this.$store.getters["message/receiver"];
            }
            return null;
        },
        isReceiver() {
            if (
                this.$store.getters["message/receiver"] &&
                this.$store.getters["message/receiver"] != null
            ) {
                return true;
            }
            return false;
        },
    },
    methods: {
        isOnline(id) {
            if (id) {
                return this.listUsersOnline.find((user) => user.id == id);
            }
            return false;
        },
        setCalling(calling = true) {
            return this.$store.commit("message/setCalling", calling);
        },
        setIcmc(icmc) {
            return this.$store.commit("message/setIncomingCall", icmc);
        },
        debounceSearchUser: debounce(function (e) {
            this.isLoadingUsers = true;
            this.$store
                .dispatch("users/searchUser", e.target.value)
                .then((req) => {
                    this.isLoadingUsers = false;
                })
                .catch((err) => {
                    this.isLoadingUsers = false;
                });
        }, 400),
        debounceSearchGroup: debounce(function (e) {
            this.isLoadingGroup = true;
            this.$store
                .dispatch("users/searchGroup", e.target.value)
                .then((req) => {
                    this.isLoadingGroup = false;
                })
                .catch((err) => {
                    this.isLoadingGroup = false;
                });
        }, 400),
        makeAvatar(avatar) {
            if (avatar != null) {
                return avatar;
            }
            return "https://res.cloudinary.com/vanh-tech/image/upload/v1652075156/rs.jpg";
        },
        formatTime($time) {
            return this.$moment($time).fromNow();
        },
        formatTime2($time) {
            return this.$moment($time).format("llll");
        },
        compareRoleMember(a, b) {
            if (a.role < b.role) {
                return -1;
            }
            if (a.role > b.role) {
                return 1;
            }
            return 0;
        },
        getAbsoluteHeight(el) {
            // Get the DOM Node if you pass in a string
            var styles = window.getComputedStyle(el);
            var margin =
                parseFloat(styles["marginTop"]) +
                parseFloat(styles["marginBottom"]);

            return Math.ceil(el.offsetHeight + margin);
        },
    },
};
