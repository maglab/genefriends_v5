import {
  createRouter,
  createWebHistory
} from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/start',
    name: 'Start',
    component: () => import('../views/Start.vue'),
    children: [{
      path: 'input',
      component: () => import('../components/search_components/Input.vue')
    },
    {
      path: 'setup',
      component: () => import('../components/search_components/Setup.vue')
    },
    {
      path: 'results',
      component: () => import('../components/search_components/Results.vue'),
      name: "Results",
      children: [{
        path: 'genestable',
        component: () => import('../components/auxiliary_components/GenesTable')
      },
      {
        path: 'davidtable',
        component: () => import('../components/auxiliary_components/DavidTable')
      },
      {
        path: 'analytics',
        component: () => import('../components/auxiliary_components/Analytics')
      },
      {
        path: 'graph',
        component: () => import('../components/auxiliary_components/Graph')
      }]
    }]
  },
  {
    path: '/team',
    name: 'OurTeam',
    component: () => import('../views/OurTeam.vue')
  },
  {
    path: '/references',
    name: 'References',
    component: () => import('../views/References.vue')
  },
  {
    path: '/saved',
    name: 'Saved',
    component: () => import('../views/Saved.vue')
  },
  {
    path: '/deprecated',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router