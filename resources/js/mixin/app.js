export default {
    computed: {
        dialogErr() {
            return this.$store.getters["app/dialogErr"];
        },
    },
    computed: {
        emojiPicker() {
            return this.$store.getters["message/emojiPickerMsg"];
        },
    },
    methods: {
        getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        },
        async getThumbnailForVideo(videoUrl) {
            const video = document.createElement("video");
            const canvas = document.createElement("canvas");
            video.style.display = "none";
            canvas.style.display = "none";

            // Trigger video load
            await new Promise((resolve, reject) => {
                video.addEventListener("loadedmetadata", () => {
                    video.width = video.videoWidth;
                    video.height = video.videoHeight;
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    // Seek the video to 25%
                    video.currentTime = video.duration * 0.25;
                });
                video.addEventListener("seeked", () => resolve());
                video.src = videoUrl;
            });

            // Draw the thumbnailz
            canvas
                .getContext("2d")
                .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const imageUrl = canvas.toDataURL("image/png");
            return imageUrl;
        },
        setEmoji(picker) {
            return this.$store.commit("message/setEmojiPicker", picker);
        },
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
