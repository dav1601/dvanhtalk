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

        name() {
            return this.$store.getters["auth/name"];
        },
        email() {
            return this.$store.getters["auth/email"];
        },
        id() {
            return this.$store.getters["auth/id"];
        },
        full() {
            return this.$store.getters["auth/full"];
        },
        avatar() {
            if (this.$store.getters["auth/avatar"] != null) {
                return this.$store.getters["auth/avatar"];
            }
            return "https://res.cloudinary.com/vanh-tech/image/upload/v1652075156/rs.jpg";
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
        listUser() {
            return this.$store.getters["users/users"];
        },
        listUsersOnline() {
            return this.$store.getters["users/usersOnline"];
        },
        receiver() {
            return this.$store.getters["message/receiver"];
        },
    },
    methods: {
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
    },
};
