import Vue from "vue";
import Vuex from "vuex";
import users from "./modules/users";
import message from "./modules/message";
import auth from "./modules/auth";
import createMutationsSharer from "vuex-shared-mutations";
Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        auth,
        users,
        message,
    },
    plugins: [
        createMutationsSharer({
            predicate: [
                "message/setCalling",
                "message/setIncomingCall",
                "message/pushMessage",
            ],
        }),
    ],
});
export default store;
