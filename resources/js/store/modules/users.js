import axios from "axios";
import Vue from "vue";
const state = () => ({
    users: [],
    test: [],
    myGroupsJoined: [],
    myGroups: [],
    usersOnline: [],
    usersMyRoom: [],
    groups: [],
    founderGroupCurrent: null,
    usersGroupCurrent: [],
    usersGroupCurrentOnline: [],
    receiverInRoom: false,
});

function getIndexGroupById(group, id) {
    let index = -1;
    if (Array.isArray(group)) {
        index = group.findIndex((g) => {
            return g.id == id;
        });
    }
    return index;
}
function getIndexUserById(users, userId) {
    let index = -1;
    index = users.findIndex((user) => {
        return user.id == userId;
    });
    return index;
}

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
        s.users = p;
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
    updateLastMessage(s, p) {
        const indexRcv = s.users.findIndex((el) => {
            return el.id == p.rcv_id;
        });
        const indexSd = s.users.findIndex((el) => {
            return el.id == p.sd_id;
        });
        if (indexRcv != -1) {
            s.users[indexRcv].lastest_msg = p;
        }
        if (indexSd != -1) {
            s.users[indexSd].lastest_msg = p;
        }
    },
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
        const index_1 = getIndexGroupById(s.groups, p.groups_id);
        if (index_1 != -1) {
            await s.groups[index_1].requests_join.push(p);
        }
        const index_2 = getIndexGroupById(s.myGroups, p.groups_id);
        if (index_2 != -1) {
            await s.myGroups[index_2].requests_join.push(p);
        }
        const index_3 = getIndexGroupById(s.myGroupsJoined, p.groups_id);
        if (index_3 != -1) {
            await s.myGroupsJoined[index_3].requests_join.push(p);
        }
    },
    async removeRequestJoinGroup(s, p) {
        const index_1 = getIndexGroupById(s.groups, p.groups_id);
        if (index_1 != -1) {
            const newGroup = s.groups[index_1].requests_join.filter((e) => {
                return e.id != p.id;
            });
            s.groups[index_1].requests_join = newGroup;
        }
        // //////
        const index_2 = getIndexGroupById(s.myGroups, p.groups_id);
        if (index_2 != -1) {
            const newGroup2 = s.myGroups[index_2].requests_join.filter((e) => {
                return e.id != p.id;
            });
            s.myGroups[index_2].requests_join = newGroup2;
        }
        // //////////////////
        const index_3 = getIndexGroupById(s.myGroupsJoined, p.groups_id);
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
        const index_1 = getIndexGroupById(s.groups, p.request.groups_id);
        if (index_1 != -1) {
            await s.groups[index_1].members.push(p.member);
        }
        // /////
        const index_2 = getIndexGroupById(s.myGroups, p.request.groups_id);
        if (index_2 != -1) {
            await s.myGroups[index_2].members.push(p.member);
        }
        // ////////////////
        const index_3 = getIndexGroupById(
            s.myGroupsJoined,
            p.request.groups_id
        );
        if (index_3 != -1) {
            await s.myGroupsJoined[index_3].members.push(p.member);
        }
    },
    async pushNewUser(s, p) {
        await s.users.push(p);
    },
    async updateGroup(s, p) {
        const index_1 = getIndexGroupById(s.groups, p.id);
        const index_2 = getIndexGroupById(s.myGroupsJoined, p.id);
        if (index_1 != -1) {
            await Vue.set(s.groups, index_1, p);
        }
        if (index_2 != -1) {
            await Vue.set(s.myGroupsJoined, index_2, p);
        }
    },
    async updateUser(s, p) {
        const index = getIndexUserById(s.users, p.id);
        if (index != -1) {
            await Vue.set(s.users, index, p);
        }
    },
    updatePosUsers(s, p) {
        const index = s.users.findIndex((user) => {
            return user.id == p;
        });
        if (index != 0) {
            const user = s.users[index];
            s.users.splice(index, 1);
            s.users.unshift(user);
        }
    },
};

const actions = {
    getUsers(c) {
        return new Promise((rs, rj) => {
            axios
                .get(route("user.users"))
                .then((req) => {
                    c.commit("setUsers", req.data);
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    getUser(c, p) {
        return new Promise((rs, rj) => {
            axios
                .get(
                    route("user.user", {
                        id: p,
                    })
                )
                .then((req) => {
                    c.commit("updateUser", req.data);
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    getUserUpdate(c, p) {
        c.dispatch("getUser", p.id);
        if (
            c.rootGetters["message/typeChat"] == 0 &&
            c.rootGetters["message/receiver"] != null
        ) {
            c.commit("message/setReceiver", p, { root: true });
        }
        if (
            c.rootGetters["message/typeChat"] == 1 &&
            c.rootGetters["message/receiver"] != null
        ) {
            c.commit("message/updateMember", p, { root: true });
        }
    },
    getHandleUser(c, p) {
        c.commit("updateUser", p);
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
    getHandleActions(c, p) {
        c.dispatch("updateGroupAndReceiver", p.newestGr);
    },
    pushUsersOnline(c, p) {
        c.commit("pushUserOnline", p);
    },
    pushMyRoom(c, p) {
        c.commit("message/updateSeenAllMessage", p, { root: true });
        c.commit("pushMyRoom", p);
    },
    getUsersMyRoom(c, p) {
        c.commit("setUsersMyRoom", p);
    },
    getUsersOnline(c, p) {
        c.commit("setUsersOnline", p);
    },
    getUsersMyRoom(c, p) {
        console.log(p);
        c.commit("message/setInRoom", p, { root: true });
    },
    deleteUser(c, p) {
        axios
            .all([
                axios.get(
                    route("update.offline", {
                        id: p.id,
                    })
                ),
            ])
            .then((req) => {
                req.forEach((rq) => {
                    c.commit("deleteUser", rq.data);
                    c.commit("updateUser", rq.data);
                });
            })
            .catch((err) => {});
    },
    searchUser(c, p) {
        return new Promise((rs, rj) => {
            axios
                .get(route("users"), { params: { keyword: p } })
                .then((req) => {
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
                .post("/save__group", data, config)
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
                    c.commit("updateGroup", req.data.data.newestGr);
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    updateGroupAndReceiver(c, p) {
        c.commit("updateGroup", p);
        c.commit("message/setReceiver", p, { root: true });
    },
    getReq(c, p) {
        c.dispatch("updateGroupAndReceiver", p.newestGr);
    },
    getDataHandleRequest(c, p) {
        c.dispatch("updateGroupAndReceiver", p.request.newestGr);
    },
    getDataGroupSave(c, p) {
        c.dispatch("updateGroupAndReceiver", p);
    },
    handleRequest(c, p) {
        let data = new FormData();
        data.append("req", JSON.stringify(p.req));
        data.append("status", p.status);
        return new Promise((rs, rj) => {
            axios
                .post(route("handle.gr.req.join"), data)
                .then((req) => {
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    saveDataGroup(c, p) {
        let data = new FormData();
        data.append("groups_id", p.groups_id);
        data.append("name", p.name);
        for (let i = 0; i < p.selected.length; i++) {
            data.append("members[]", JSON.stringify(p.selected[i]));
        }
        return new Promise((rs, rj) => {
            axios
                .post(route("handle.gr.req.saveData"), data)
                .then((req) => {
                    rs(req);
                })
                .catch((err) => {
                    rj(err);
                });
        });
    },
    handleActionsGroup(c, p) {
        let data = new FormData();
        data.append("users_id", p.users_id);
        data.append("groups_id", p.groups_id);
        data.append("action", p.action);
        return new Promise((rs, rj) => {
            axios
                .post(route("handle.gr.req.actions"), data)
                .then((req) => {
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
    getNewUser(c, p) {
        c.commit("pushNewUser", p);
    },
    getSimpleUser(c, p) {
        return new Promise((rs, rj) => {
            axios
                .get(
                    route("user.simple", {
                        id: p,
                    })
                )
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
