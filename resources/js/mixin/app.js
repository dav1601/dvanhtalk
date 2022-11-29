export default {
    computed: {
        dialogErr() {
            return this.$store.getters["app/dialogErr"];
        },
    },
    methods: {
        lengthObj(obj) {
            return Object.keys(obj).length;
        },
        setDialogErr(open = false) {
            return this.$store.commit("app/setDialogErr", open);
        },
        typem(type) {
            switch (type) {
                case 1:
                    return "text";

                case 2:
                    return "image";

                case 3:
                    return "audio";

                case 4:
                    return "gnoti";

                case 5:
                    return "call";

                case 6:
                    return "record";

                case 7:
                    return "video";

                default:
                    break;
            }
            switch (type) {
                case "text":
                    return 1;

                case "image":
                    return 2;

                case "audio":
                    return 3;

                case "gnoti":
                    return 4;

                case "call":
                    return 5;

                case "record":
                    return 6;

                case "video":
                    return 7;

                default:
                    break;
            }
            return 0;
        },
    },
};
