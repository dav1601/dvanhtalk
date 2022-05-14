import axios from "axios";
const state = () => ({
    users: [],
    usersOnline: [],
    usersMyRoom: [],
});

const getters = {
    users(s) {
        return s.users;
    },
    usersOnline(s) {
        return s.usersOnline;
    },
    usersMyRoom(s) {
        return s.usersMyRoom;
    },
};

const mutations = {
    setUsers(s, p) {
        return (s.users = p);
    },
    setUsersOnline(s, p) {
        return (s.usersOnline = p);
    },
    setUsersMyRoom(s, p) {
        return (s.usersMyRoom = p);
    },
    pushUserOnline(s, p) {
        if (s.usersOnline.find((user) => user.id == p.id)) {
            return;
        }
        return s.usersOnline.push(p);
    },
    deleteUserMyRoom(s, p) {
        let updateUsers = s.usersMyRoom.filter(function (item) {
            return item.id != p.id;
        });
        s.usersMyRoom = updateUsers;
    },
    pushMyRoom(s, p) {
        if (s.usersMyRoom.find((user) => user.id == p.id)) {
            return;
        }
        return s.usersMyRoom.push(p);
    },
    deleteUser(s, p) {
        let updateUsers = s.usersOnline.filter(function (item) {
            return item.id != p.id;
        });
        s.usersOnline = updateUsers;
    },
    deleteUserMR(s, p) {},
};

const actions = {
    getUsers(c) {
        return new Promise((rs, rj) => {
            axios
                .get("/users")
                .then((req) => {
                    c.commit("setUsers", req.data);
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    pushUsersOnline(c, p) {
        c.commit("pushUserOnline", p);
    },
    pushMyRoom(c, p) {
        c.commit("pushMyRoom", p);
    },
    getUsersMyRoom(c, p) {
        c.commit("setUsersMyRoom", p);
    },
    getUsersOnline(c, p) {
        c.commit("setUsersOnline", p);
    },
    deleteUser(c, p) {
        axios
            .all([axios.get("/update_offline/" + p.id)])
            .then((req) => {
                c.commit("deleteUser", p);
            })
            .catch((err) => {});
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};
