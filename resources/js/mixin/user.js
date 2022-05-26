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
        groups() {
            return this.$store.getters["users/groups"];
        },
        myGroups() {
            return this.$store.getters["users/myGroups"];
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
    },
};
