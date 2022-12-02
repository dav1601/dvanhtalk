const state = () => ({
    snackbar: [],
});

const getters = {
    snackbar(s) {
        return s.snackbar;
    },
};

const mutations = {
    setSnackbar(s, snackbar) {
        console.log(snackbar);
        snackbar.showing = true;
        snackbar.color = snackbar.color || "success";
        snackbar.timeout = snackbar.timeout || 10000;
        return (s.snackbar = s.snackbar.concat(snackbar));
    },
    removeSnackbar(s, index) {
        return s.snackbar.splice(index, 1);
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
