/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require("./bootstrap");
import Vue from "vue";
import router from "./router";
import store from "./store/index";
import App from "./App.vue";
import Vuetify from "vuetify";
import colors from "vuetify/lib/util/colors";
import Multiselect from "vue-multiselect";
import "bootstrap";
import Notifications from "vue-notification";
import moment from "moment";
import PerfectScrollbar from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import { ZiggyVue } from "../../vendor/tightenco/ziggy/dist/vue";
import BaseLoading from "./components/ui/BaseLoading";
import "@mdi/font/css/materialdesignicons.css";
import "vue-multiselect/dist/vue-multiselect.min.css";
Vue.use(Vuetify);
Vue.use(Notifications);
Vue.use(PerfectScrollbar);
Vue.use(ZiggyVue);
moment.locale("vi");
Vue.prototype.$moment = moment;
Vue.component("multiselect", Multiselect);
Vue.component("base-loading", BaseLoading);
Vue.directive("click-outside", {
    bind: function (el, binding, vnode) {
        window.event = function (event) {
            if (!(el == event.target || el.contains(event.target))) {
                vnode.context[binding.expression](event);
            }
        };
        document.body.addEventListener("click", window.event);
    },
    unbind: function (el) {
        document.body.removeEventListener("click", window.event);
    },
});

const app = new Vue({
    router,
    store,
    vuetify: new Vuetify({
        icons: {
            iconfont: "mdi",
        },
        theme: {
            dark: true,
            themes: {
                light: {
                    primary: colors.lightBlue,
                    secondary: colors.grey.darken1,
                    accent: colors.pink.darken1,
                    error: colors.red.accent3,
                    background: colors.indigo.lighten5,
                    info: colors.teal.darken1,
                },
                dark: {
                    primary: colors.blue.darken4,
                    background: colors.indigo.base,
                    info: colors.teal.lighten1,
                },
            },
        },
    }),
    render: (h) => h(App),
}).$mount("#app");
