/**
 * MODEL (camada de domínio) — contratos puros, sem Vue, sem UI.
 * É o coração da feature: define O QUE é uma Tarefa e suas regras.
 */

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  done: boolean
  priority: TaskPriority
  createdAt: number
}

export type TaskFilter = 'all' | 'active' | 'done'

export interface NewTaskInput {
  title: string
  priority: TaskPriority
}
