import {createRouter, createWebHistory} from "vue-router";
import SplashView from "../views/SplashView.vue";
import UserGuidelinesView from "../views/UserGuidelinesView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "splash",
            component: SplashView,
        },
        {
            path: "/user-guidelines",
            name: "user-guidelines",
            component: UserGuidelinesView,
        }
    ],
});

export default router;
