export default {
    getAssetsPath(path = "") {
        const first = Array.from(path)[0];
        let origin =
            first == "/"
                ? window.location.origin + "/assets"
                : window.location.origin + "/assets" + "/";
        return origin + path;
    },
};
