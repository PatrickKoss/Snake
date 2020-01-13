import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import DataProtection from "../views/DataProtection";
import AiPlays from "../views/AiPlays";
import VsAI from "../views/VsAI";
import VsYourself from "../views/VsYourself";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: "/data-protection",
    name: 'dataProtection',
    component: DataProtection
  },
  {
    path: "/vs-ai",
    name: 'vsAi',
    component: VsAI
  },
  {
    path: "/alone",
    name: 'alone',
    component: VsYourself
  },
  {
    path: "/ai",
    name: 'ai',
    component: AiPlays
  }
]

const router = new VueRouter({
  routes
})

export default router
