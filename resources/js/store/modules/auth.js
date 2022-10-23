const state = () => ({
    id: null,
    email: null,
    name: null,
    avatar: null,
    phoneNumber: null,
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
    phoneNumber(s) {
        return s.phoneNumber;
    },
};

const mutations = {
    updateData(s, p) {
        const prop = p.property;
        return (s[prop] = p.value);
    },
    setMe(s, p) {
        (s.id = p.id),
            (s.name = p.name),
            (s.avatar = p.avatar),
            (s.email = p.email),
            (s.phoneNumber = p.phone_number),
            (s.full = p);
    },
    setTest(s) {
        return (s.test = 1);
    },
};

const actions = {
    getMe(c, p) {
        c.commit("setMe", p);
    },
    resetMe(c) {
        c.commit("setMe", c.getters.full);
    },
    updateData(c, p) {
        const data = new FormData();
        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };

        const field = p.field == "phoneNumber" ? "phone_number" : p.field;
        data.append("field", field);
        if (field == "avatar") {
            data.append("value", p.avatar);
        } else {
            data.append("value", c.getters[p.field]);
        }

        return new Promise((rs, rj) => {
            axios
                .post(route("auth.update"), data, config)
                .then((req) => {
                    if (req.data.isValid) {
                        c.commit("setMe", req.data.me);
                    }
                    rs(req);
                })
                .catch((err) => {
                    console.log(err);
                    rj(err);
                });
        });
    },
    updateAvatar(c, p) {
        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };
        const data = new FormData();
        data.append("file", p);
        return new Promise((rs, rj) => {
            axios.post(route("test"), data, config).then((req) => {
                console.log(req);
            });
        });
    },
    sendingCode(c, p) {
        const data = new FormData();
        data.append("email", p);
        return new Promise((rs, rj) => {
            axios
                .post(route("user.password.otp"), data)
                .then((req) => {
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    savePass(c, p) {
        const data = new FormData();
        data.append("type", p.type);
        data.append("password", p.newPass);
        data.append("password_confirmation", p.newPassConf);
        if (p.type == 1) {
            data.append("old_password", p.oldPass);
        } else {
            data.append("email", p.email);
        }
        return new Promise((rs, rj) => {
            axios
                .post(route("user.password.change"), data)
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
