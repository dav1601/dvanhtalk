export default {
    data() {
        return {
            windowHeight: document.documentElement.clientHeight,
            windowWidth: document.documentElement.clientWidth,
        };
    },
    created() {
        window.addEventListener("resize", this.getDimensions);
    },
    computed: {
        isIpadProUp() {
            return this.windowWidth > 1024;
        },
    },
    methods: {
        getDimensions() {
            this.windowHeight = document.documentElement.clientHeight;
            this.windowWidth = document.documentElement.clientWidth;
            // console.log({
            //     hh: this.windowHeight,
            //     ww: this.windowWidth,
            //     h: document.documentElement.clientHeight,
            //     w: document.documentElement.clientWidth,
            // });
        },
    },
};
