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
import sanitizeHTML from "sanitize-html";
import colors from "vuetify/lib/util/colors";
import Multiselect from "vue-multiselect";
import "bootstrap";
import Notifications from "vue-notification";
import moment from "moment";
import VEmojiPicker from "v-emoji-picker";
import VueRecord from "@codekraft-studio/vue-record";
// import AudioVisual from "vue-audio-visual";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import { ZiggyVue } from "../../vendor/tightenco/ziggy/dist/vue";
import BaseLoading from "./components/ui/BaseLoading";
import "@mdi/font/css/materialdesignicons.css";
import "vue-multiselect/dist/vue-multiselect.min.css";
import ItemAvatar from "./components/users/ItemAvatar";
import DialogErr from "./components/app/dialogErr";
import helpers from "./helpers";
import responsive from "./mixin/responsive";
import user from "./mixin/user";
import appMixin from "./mixin/app";
import vi from "vuetify/lib/locale/vi";
import en from "vuetify/lib/locale/en";


Vue.use(Vuetify);
Vue.use(Notifications);
Vue.use(VEmojiPicker);
Vue.use(ZiggyVue);
Vue.use(VueRecord);
// Vue.use(AudioVisual);
Vue.mixin(user);
Vue.mixin(responsive);
Vue.mixin(appMixin);
moment.locale("vi");
Vue.prototype.$moment = moment;
Vue.prototype.$sanitize = sanitizeHTML;
Vue.component("multiselect", Multiselect);
Vue.component("base-loading", BaseLoading);
Vue.component("item-avatar", ItemAvatar);
Vue.component("dialog-err", DialogErr);
Vue.directive("dav-click-outside", {
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
const plugin = {
    install() {
        Vue.helpers = helpers;
        Vue.prototype.$helpers = helpers;
    },
};

Vue.use(plugin);
const app = new Vue({
    router,
    store,
    vuetify: new Vuetify({
        icons: {
            iconfont: "mdi",
        },
        lang: {
            locales: { vi, en },
            current: "zhHans",
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
