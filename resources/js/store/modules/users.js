import axios from "axios";
const state = () => ({
    users: [],
    myGroupsJoined: [],
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
    myGroupsJoined(s) {
        return s.myGroupsJoined;
    },
};

const mutations = {
    setUsers(s, p) {
        return (s.users = p);
    },
    setGroups(s, p) {
        return (s.groups = p);
    },
    setmyGroupsJoined(s, p) {
        return (s.myGroupsJoined = p);
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
        s.usersOnline.push(p);
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
        s.usersMyRoom.push(p);
    },
    deleteUser(s, p) {
        let updateUsers = s.usersOnline.filter(function (item) {
            return item.id != p.id;
        });
        s.usersOnline = updateUsers;
    },
    deleteUserMRoom(s, p) {},
    // AREA GROUP
    async pushGroup(s, p) {
        await s.groups.push(p);
    },
    async pushMyJoinedGroup(s, p) {
        await s.myGroupsJoined.push(p);
    },
    pushMyGroup(s, p) {
        s.myGroups.push(p);
    },
    async pushRequestJoinGroup(s, p) {
        const index_1 = s.groups.findIndex((g) => {
            return g.id == p.groups_id;
        });
        if (index_1 != -1) {
            await s.groups[index_1].requests_join.push(p);
        }
        const index_2 = s.myGroups.findIndex((g2) => {
            return g2.id == p.groups_id;
        });
        if (index_2 != -1) {
            await s.myGroups[index_2].requests_join.push(p);
        }
        const index_3 = s.myGroupsJoined.findIndex((g3) => {
            return g3.id == p.groups_id;
        });
        if (index_3 != -1) {
            await s.myGroupsJoined[index_3].requests_join.push(p);
        }
        console.log(index_1, index_2, index_3);
    },
    async removeRequestJoinGroup(s, p) {
        const index_1 = s.groups.findIndex((g) => {
            return g.id == p.groups_id;
        });
        if (index_1 != -1) {
            const newGroup = s.groups[index_1].requests_join.filter((e) => {
                return e.id != p.id;
            });
            s.groups[index_1].requests_join = newGroup;
        }
        // //////
        const index_2 = s.myGroups.findIndex((g2) => {
            return g2.id == p.groups_id;
        });
        if (index_2 != -1) {
            const newGroup2 = s.myGroups[index_2].requests_join.filter((e) => {
                return e.id != p.id;
            });
            s.myGroups[index_2].requests_join = newGroup2;
        }
        // //////////////////
        const index_3 = s.myGroupsJoined.findIndex((g3) => {
            return g3.id == p.groups_id;
        });
        if (index_3 != -1) {
            const newGroup3 = s.myGroupsJoined[index_3].requests_join.filter(
                (e) => {
                    return e.id != p.id;
                }
            );
            s.myGroupsJoined[index_3].requests_join = newGroup3;
        }
    },
    async pushMemberGroup(s, p) {
        const index_1 = s.groups.findIndex((g) => {
            return g.id == p.request.groups_id;
        });
        if (index_1 != -1) {
            await s.groups[index_1].members.push(p.member);
        }
        // /////
        const index_2 = s.myGroups.findIndex((g2) => {
            return g2.id == p.request.groups_id;
        });
        if (index_2 != -1) {
            await s.myGroups[index_2].members.push(p.member);
        }
        // ////////////////
        const index_3 = s.myGroupsJoined.findIndex((g3) => {
            return g3.id == p.request.groups_id;
        });
        if (index_3 != -1) {
            await s.myGroupsJoined[index_3].members.push(p.member);
        }
    },

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
                    const myGroupsJoined = [];
                    req.data.my_groups_joined.forEach((element) => {
                        myGroupsJoined.push(element.group);
                    });
                    c.commit("setmyGroupsJoined", myGroupsJoined);
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
    getGroup(c, p) {
        c.commit("pushGroup", p);
        if (
            p.members.find((user) => user.users_id == c.rootGetters["auth/id"])
        ) {
            c.commit("pushMyJoinedGroup", p);
        }
    },
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
                    c.commit("pushMyGroup", req.data.data);
                    c.commit("pushMyJoinedGroup", req.data.data);
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    rqJoinGr(c, p) {
        let data = new FormData();
        data.append("group_id", p.groupId);
        return new Promise((rs, rj) => {
            axios
                .post("/saveRequest", data)
                .then((req) => {
                    let data = req.data.data;
                    delete data.group;
                    c.commit("pushRequestJoinGroup", data);
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    getReq(c, p) {
        c.commit("pushRequestJoinGroup", p);
        c.commit("message/updateReqJoin", p, { root: true });
    },
    getDataHandleRequest(c, p) {
        c.commit("removeRequestJoinGroup", p.request);
        c.commit("message/removeReqJoin", p.request, { root: true });
        if (p.status == 1) {
            c.commit("pushMemberGroup", p);
            c.commit("message/pushMember", p, { root: true });
        }
    },
    handleRequest(c, p) {
        console.log(p);
        let data = new FormData();
        data.append("req", JSON.stringify(p.req));
        data.append("status", p.status);
        return new Promise((rs, rj) => {
            axios
                .post(route("handle.gr.req"), data)
                .then((req) => {
                    rs(req);
                })
                .catch((err) => {
                    console.log(err);
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
