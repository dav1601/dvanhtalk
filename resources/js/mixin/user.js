export default {
    computed: {
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

    },
    methods: {
        makeAvatar(avatar) {
            if (avatar != null) {
                return avatar;
            }
            return "https://res.cloudinary.com/vanh-tech/image/upload/v1652075156/rs.jpg";
        },
        formatTime($time) {
            return this.$moment($time).fromNow();
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
