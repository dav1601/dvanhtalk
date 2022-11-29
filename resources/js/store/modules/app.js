import axios from "axios";
const state = () => ({
    dialogErr: false,
    process: 0,
});

const getters = {
    dialogErr(s) {
        return s.dialogErr;
    },
    process(s) {
        return s.process;
    },
};

const mutations = {
    setDialogErr(s, p) {
        return (s.dialogErr = p);
    },
    setProcess(s, p) {
        return (s.process = p);
    },
};

const actions = {
    callApi(c, p) {
        var instance = axios.create();
        delete instance.defaults.headers.common["X-Socket-Id"];
        const config = {
            onUploadProgress: (progressEvent) => {
                console.log("progress", progressEvent);
                var progress = Math.round(
                    (progressEvent.loaded * 100.0) / progressEvent.total
                );
                //bind "this" to access vue state during callback
            },
        };
        return new Promise((rs, rj) => {
            instance
                .post(p.url, p.data, config)
                .then((req) => {
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};
