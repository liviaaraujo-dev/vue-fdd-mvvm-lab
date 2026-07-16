import type { NewTaskInput, Task, TaskFilter, TaskPriority } from './task.types'

/**
 * Regras de negócio puras da entidade Task.
 * Sem estado reativo, sem dependência de framework — 100% testável isolado.
 */

let seq = 0
function generateId(): string {
  seq += 1
  return `task_${Date.now().toString(36)}_${seq}`
}

export function createTask(input: NewTaskInput): Task {
  const title = input.title.trim()
  if (!title) {
    throw new Error('O título da tarefa não pode ser vazio.')
  }
  return {
    id: generateId(),
    title,
    done: false,
    priority: input.priority,
    createdAt: Date.now(),
  }
}

export function toggleTask(task: Task): Task {
  return { ...task, done: !task.done }
}

export function matchesFilter(task: Task, filter: TaskFilter): boolean {
  if (filter === 'active') return !task.done
  if (filter === 'done') return task.done
  return true
}

const PRIORITY_WEIGHT: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 }

/** Ordena por status (pendentes primeiro) e depois por prioridade. */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
  })
}

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}
