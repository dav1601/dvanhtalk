const state = () => ({
    snackbar: [],
    errorsApi: {},
});

const getters = {
    snackbar(s) {
        return s.snackbar;
    },
    errorsApi(s) {
        return s.errorsApi;
    },
};

const mutations = {
    setSnackbar(s, snackbar) {
        console.log(snackbar);
        snackbar.showing = true;
        snackbar.color = snackbar.color || "success";
        snackbar.timeout = snackbar.timeout || 10000;
        // return (s.snackbar = s.snackbar.concat(snackbar));
        return s.snackbar.push(snackbar);
    },
    removeSnackbar(s, index) {
        return s.snackbar.splice(index, 1);
    },
    rsErrApi(s, type) {
        delete s.errorsApi[type];
    },
    addErrApi(s, p) {
        return (s.errorsApi[p.type] = p.text);
    },
};
const actions = {};

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};
