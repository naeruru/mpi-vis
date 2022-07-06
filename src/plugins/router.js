import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import Visualize from '../pages/Visualize.vue'
import Header from '../components/Header.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    components: {
        default: Home,
        Header
    }
    },
    {
        path: '/visualize',
        name: 'visualize',
        components: {
            default: Visualize,
            Header
        }
    },
]

export default new createRouter({
  history: createWebHistory(),
  routes,
})