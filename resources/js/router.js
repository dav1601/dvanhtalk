import Vue from "vue";
import VueRouter from "vue-router";
import TheLobby from "./pages/TheLobby.vue";
import ChatLayout from "./pages/ChatLayout";
import NotFound from "./pages/NotFound";
Vue.use(VueRouter);
const routes = [
    {
        path: "/",
        name: "home",
        component: TheLobby,
        children: [
            {
                path: "/chat/:friendId",
                name: "chat",
                component: ChatLayout,
                props: true,
            },
            {
                path: "/group/:friendId",
                name: "group",
                component: ChatLayout,
                props: true,
            },
        ],
    },
    {
        path: "/:notFound(.*)",
        name: "404",
        component: NotFound,
    },
];

const router = new VueRouter({
    mode: "history",
    routes,
});
export default router;
