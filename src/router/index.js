import Vue from 'vue'
import VueRoter from 'vue-router';
Vue.use(VueRoter)

export default new VueRoter({
    mode: 'history',
    scrollBehavior(to, from, ) {
        return { x: 0, y: 0 }
    },
    routes: [
        {
            path: '/',
            name: 'defaultPage',
            component: () => import('@/layout/default.vue'),
            redirect: '/todolist',
            children: [
                {
                    path: '/todolist',
                    name: 'todolist',
                    component: () => import('@/components/todolist/index.vue')
                },
                {
                    path: '/note/:noteId',
                    name: 'note',
                    component: () => import('@/components/note/index.vue')
                },
                {
                    path: '/diary',
                    name: 'diary',
                    component: () => import('@/components/diary/index.vue')
                },
                {
                    path: '/wEditor',
                    name: 'wEditor',
                    component: () => import('@/components/wEditor/index.vue')
                },
            ]
        },
        {
            path: '/edit/:editId',
            name: 'edit',
            component: () => import('@/components/Pro/Pro.vue')
        },
        // {
        //     path: '/wEditor',
        //     name: 'wEditor',
        //     component: () => import('@/components/wEditor/index.vue')
        // },
        {
            path: '/mindEdit',
            name: 'mindEdit',
            component: () => import('@/components/jsMind/index.vue')
        }
    ]
})