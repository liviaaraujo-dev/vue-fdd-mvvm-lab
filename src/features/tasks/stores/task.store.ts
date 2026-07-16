import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createTask, toggleTask } from '../domain/task.entity'
import type { NewTaskInput, Task } from '../domain/task.types'
import { taskRepository } from '../data/task.repository'

/**
 * STORE (Pinia) — dono do ESTADO da feature (o "Model" observável).
 * Fala com a data layer e aplica as regras do domínio. Não sabe nada de UI.
 */
export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function persist() {
    await taskRepository.save(tasks.value)
  }

  async function load() {
    loading.value = true
    error.value = null
    try {
      tasks.value = await taskRepository.list()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function add(input: NewTaskInput) {
    try {
      tasks.value = [createTask(input), ...tasks.value]
      await persist()
    } catch (e) {
      error.value = (e as Error).message
    }
  }

  async function toggle(id: string) {
    tasks.value = tasks.value.map((t) => (t.id === id ? toggleTask(t) : t))
    await persist()
  }

  async function remove(id: string) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
    await persist()
  }

  async function clearCompleted() {
    tasks.value = tasks.value.filter((t) => !t.done)
    await persist()
  }

  return { tasks, loading, error, load, add, toggle, remove, clearCompleted }
})
