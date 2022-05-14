const state = () => ({
    id: null,
    email: null,
    name: null,
    avatar: null,
});

const getters = {
    id(s) {
        return s.id;
    },
    email(s) {
        return s.email;
    },
    name(s) {
        return s.name;
    },
    avatar(s) {
        return s.avatar;
    },
};

const mutations = {
    setMe(s, p) {
        (s.id = p.id),
            (s.name = p.name),
            (s.avatar = p.avatar),
            (s.email = p.email);
    },
};

const actions = {
    getMe(c) {
        return new Promise((rs, rj) => {
            axios
                .get("/me")
                .then((req) => {
                    const data = {
                        email: req.data.me.email,
                        id: req.data.me.id,
                        name: req.data.me.name,
                        avatar: null,
                    };
                    c.commit("setMe", data);
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
