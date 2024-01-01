import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import { authGuard, authNone } from './authGuard'
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

// export default route(function ( { store, ssrContext } ) {
const createHistory = process.env.SERVER
  ? createMemoryHistory
  : process.env.VUE_ROUTER_MODE === 'history'
  ? createWebHistory
  : createWebHashHistory

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes: [
    {
      path: '/',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          beforeEnter: [authGuard],
          component: () => import('pages/IndexPage.vue'),
        },
        {
          path: 'login',
          name: 'Login',
          beforeEnter: [authNone],
          component: () => import('pages/LoginPage.vue'),
        },
        {
          path: '/register',
          name: 'Register',
          beforeEnter: [authNone],
          component: () => import('pages/RegisterPage.vue'),
        },
        {
          path: '/social',
          beforeEnter: [authGuard],
          component: () => import('pages/social/SocialOverview.vue'),
          children: [
            {
              path: 'groups',
              name: 'Groups',
              beforeEnter: [authGuard],
              component: () => import('pages/social/GroupsOverview.vue'),
              children: [
                {
                  path: 'add',
                  name: 'Create groups',
                  beforeEnter: [authGuard],
                  component: () => import('components/organisms/AddFriend.vue'),
                },
                {
                  path: ':id',
                  name: 'Group detail',
                  beforeEnter: [authGuard],
                  component: () => import('components/organisms/GroupDetail.vue'),
                },
              ],
            },
            {
              path: 'friends',
              name: 'Friends',
              beforeEnter: [authGuard],
              component: () => import('pages/social/FriendsOverview.vue'),
              children: [
                {
                  path: 'add',
                  beforeEnter: [authGuard],
                  name: 'Add Friends',
                  component: () => import('components/organisms/AddFriend.vue'),
                },
              ],
            },
            {
              path: '',
              redirect: '/social/friends',
            },
          ],
        },
        {
          path: '/create',
          beforeEnter: [authGuard],
          component: () => import('pages/AddPage.vue'),
          children: [
            {
              path: '',
              beforeEnter: [authGuard],
              name: 'Create',
              component: () => import('components/templates/CreateMainPage.vue'),
            },
            {
              path: 'bill',
              beforeEnter: [authGuard],
              name: 'Create receipt',
              component: () => import('components/templates/PersonalReceiptForm.vue'),
            },
          ],
        },
        {
          path: '/activity',
          name: 'Activity',
          beforeEnter: [authGuard],
          component: () => import('pages/ActivityPage.vue'),
        },
        {
          path: '/receipts',
          name: 'Receipts',
          beforeEnter: [authGuard],
          component: () => import('pages/ReceiptPage.vue'),
          children: [
            {
              path: ':index',
              beforeEnter: [authGuard],
              name: 'Receipt details',
              component: () => import('components/templates/ReceiptDetail.vue'),
            },
          ],
        },
        {
          path: '/account',
          name: 'Account',
          beforeEnter: [authGuard],
          component: () => import('pages/AccountPage.vue'),
        },
      ],
    },

    {
      path: '/:catchAll(.*)*',
      component: () => import('pages/ErrorNotFound.vue'),
    },
  ],

  // Leave this as is and make changes in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  history: createHistory(process.env.VUE_ROUTER_BASE),
})

/*
  return Router
})*/

export default router
