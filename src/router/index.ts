import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

/**
 * ROTAS por feature (padrão FDD): cada tela vem da API pública da sua feature,
 * carregada de forma lazy. O router não conhece os detalhes internos delas.
 */
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/tasks' },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import('@/features/tasks').then((m) => m.TasksView),
    meta: { title: 'Tarefas' },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/features/dashboard/views/DashboardView.vue'),
    meta: { title: 'Dashboard' },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
