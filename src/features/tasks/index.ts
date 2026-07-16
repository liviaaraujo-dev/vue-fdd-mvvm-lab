/**
 * PUBLIC API da feature (padrão FDD).
 * O resto do app só importa daqui — os detalhes internos (store, repo, domain)
 * ficam encapsulados. Trocar a implementação interna não quebra quem consome.
 */
export { default as TasksView } from './views/TasksView.vue'
export { useTaskStore } from './stores/task.store'
export type { Task, TaskPriority } from './domain/task.types'
