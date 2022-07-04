export default {
    computed: {
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
    },
    methods: {
        backHome() {
            return this.$router.push({ name: "home" });
        },
    },
};
