import axios from "axios";
const state = () => ({
    users: [],
    myGroups: [],
    usersOnline: [],
    usersMyRoom: [],
    groups: [],
    founderGroupCurrent: null,
    usersGroupCurrent: [],
    usersGroupCurrentOnline: [],
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
    groups(s) {
        return s.groups;
    },
};

const mutations = {
    setUsers(s, p) {
        return (s.users = p);
    },
    setGroups(s, p) {
        return (s.groups = p);
    },
    setMyGroups(s, p) {
        return (s.myGroups = p);
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
    // AREA GROUP
    pushGroup(s, p) {},
    setCurrentGroup(s, p) {},
    pushUserOnlineGroup(s, p) {},
    deleteGroup(s, p) {},
    kickUser(s, p) {},
    banUser(s, p) {},
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
    getGroups(c) {
        return new Promise((rs, rj) => {
            axios
                .get("/groups")
                .then((req) => {
                    c.commit("setGroups", req.data.groups);
                    c.commit("setMyGroups", req.data.my_groups);
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
    searchUser(c, p) {
        return new Promise((rs, rj) => {
            axios
                .get("users", { params: { keyword: p } })
                .then((req) => {
                    console.log(req);
                    c.commit("setUsers", req.data);
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    searchGroup(c, p) {
        return new Promise((rs, rj) => {
            axios
                .get("/groups", { params: { keyword: p } })
                .then((req) => {
                    console.log(req);
                    c.commit("setGroups", req.data);
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    // Area Group
    addGroup(c, p) {
        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };
        let data = new FormData();
        data.append("file", p.file);
        data.append("name", p.name);
        for (let i = 0; i < p.selected.length; i++) {
            data.append("members[]", JSON.stringify(p.selected[i]));
        }
        return new Promise((rs, rj) => {
            axios
                .post("/saveGroup", data, config)
                .then((req) => {
                    c.commit("pushGroup", req.data.data);
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    addUserGroup(c, p) {},
    deleteUserGroup(c, p) {},
    banUserGroup(c, p) {},
};

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};
