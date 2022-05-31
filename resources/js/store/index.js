import Vue from "vue";
import Vuex from "vuex";
import users from "./modules/users";
import message from "./modules/message";
import auth from "./modules/auth";
Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        auth,
        users,
        message,
    },
});
export default store;
