export default {
    getAssetsPath(path = "") {
        const first = Array.from(path)[0];
        let origin =
            first == "/"
                ? window.location.origin + "/assets"
                : window.location.origin + "/assets" + "/";
        return origin + path;
    },
    fancyTimeFormat(duration) {
        // Hours, minutes and seconds
        var hrs = ~~(duration / 3600);
        var mins = ~~((duration % 3600) / 60);
        var secs = ~~duration % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    },
    isEmpty(obj) {
        if (!obj) {
            return true;
        }
        return Object.keys(obj).length === 0;
    },

};
