import type { Task } from '../domain/task.types'

/**
 * DATA LAYER — abstrai a persistência. Hoje é localStorage; amanhã poderia
 * ser uma API HTTP sem que store/viewmodel/view mudem uma linha.
 */

const STORAGE_KEY = 'fdd-lab:tasks'
const LATENCY_MS = 250 // simula latência de rede

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS))
}

const seed: Task[] = [
  { id: 'seed_1', title: 'Estudar arquitetura FDD', done: false, priority: 'high', createdAt: Date.now() - 3000 },
  { id: 'seed_2', title: 'Entender MVVM com composables', done: false, priority: 'medium', createdAt: Date.now() - 2000 },
  { id: 'seed_3', title: 'Instalar shadcn-vue', done: true, priority: 'low', createdAt: Date.now() - 1000 },
]

function read(): Task[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
  }
  try {
    return JSON.parse(raw) as Task[]
  } catch {
    return []
  }
}

function write(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export const taskRepository = {
  async list(): Promise<Task[]> {
    return delay(read())
  },
  async save(tasks: Task[]): Promise<void> {
    write(tasks)
    return delay(undefined)
  },
}

export type TaskRepository = typeof taskRepository
