const state = () => ({
    id: null,
    email: null,
    name: null,
    avatar: null,
    full: null,
    test: null,
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
    full(s) {
        return s.full;
    },
    test(s) {
        return s.test;
    },
};

const mutations = {
    setMe(s, p) {
        (s.id = p.id),
            (s.name = p.name),
            (s.avatar = p.avatar),
            (s.email = p.email),
            (s.full = p);
    },
    setTest(s) {
        return (s.test = 1);
    },
};

const actions = {
    async getMe(c) {
        try {
            const res = await axios.get("/me");
            const data = {
                email: res.data.me.email,
                id: res.data.me.id,
                name: res.data.me.name,
                avatar: null,
            };
            c.commit("setMe", data);
        } catch (err) {
            throw err;
        }
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};
