import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import DataProtection from "../views/DataProtection";
import AiPlays from "../views/AiPlays";
import VsAI from "../views/VsAI";
import VsYourself from "../views/VsYourself";
import Login from "../views/Login";
import Register from "../views/Register";
import Account from "../views/Account";
import Leaderboard from "../views/Leaderboard";

Vue.use(VueRouter);

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    icon: "mdi-home",
    loggedIn: 0
  },
  {
    path: "/solo-game",
    name: 'Solo Game',
    component: VsYourself,
    icon: "mdi-google-controller",
    loggedIn: 0
  },
  {
    path: "/vs-ai",
    name: 'Play vs AI',
    component: VsAI,
    icon: "mdi-brightness-5",
    loggedIn: 0
  },
  {
    path: "/ai",
    name: 'AI Plays',
    component: AiPlays,
    icon: "mdi-quadcopter",
    loggedIn: 0
  },
  {
    path: "/leaderboard",
    name: 'Leaderboard',
    component: Leaderboard,
    icon: "mdi-format-list-bulleted",
    loggedIn: 0
  },
  {
    path: "/account",
    name: 'Account',
    component: Account,
    icon: "mdi-account",
    loggedIn: 1
  },
  {
    path: "/data-protection",
    name: 'Privacy Policy',
    component: DataProtection,
    icon: "mdi-shield-half-full",
    loggedIn: -2
  },
  {
    path: "/login",
    name: 'Login',
    component: Login,
    icon: "mdi-login",
    loggedIn: -1
  },
  {
    path: "/logout",
    name: 'Logout',
    component: Home,
    icon: "mdi-logout",
    loggedIn: 1
  },
  {
    path: "/register",
    name: 'Register',
    component: Register,
    icon: "mdi-plus-box",
    loggedIn: -2
  },
];

const router = new VueRouter({
  routes
});

export default router
