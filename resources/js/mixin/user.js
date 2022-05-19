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
    },
};
