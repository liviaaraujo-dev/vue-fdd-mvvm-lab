import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { matchesFilter, sortTasks } from '../domain/task.entity'
import type { TaskFilter, TaskPriority } from '../domain/task.types'
import { useTaskStore } from '../stores/task.store'

/**
 * VIEWMODEL (MVVM) — a ponte entre a View e o Model.
 *
 * Responsabilidades:
 *  - Guarda o estado que é SÓ da tela (filtro atual, campos do formulário).
 *  - Expõe dados JÁ prontos para renderizar (listas derivadas, contadores).
 *  - Traduz interações do usuário em comandos para a store.
 *
 * A View (.vue) fica "burra": só consome o que o ViewModel oferece.
 */
export function useTaskListViewModel() {
  const store = useTaskStore()
  const { tasks, loading, error } = storeToRefs(store)

  const filter = ref<TaskFilter>('all')
  const draftTitle = ref('')
  const draftPriority = ref<TaskPriority>('medium')

  const visibleTasks = computed(() =>
    sortTasks(tasks.value.filter((t) => matchesFilter(t, filter.value))),
  )

  const stats = computed(() => {
    const total = tasks.value.length
    const done = tasks.value.filter((t) => t.done).length
    return {
      total,
      done,
      active: total - done,
      progress: total === 0 ? 0 : Math.round((done / total) * 100),
    }
  })

  const canSubmit = computed(() => draftTitle.value.trim().length > 0)

  async function submitDraft() {
    if (!canSubmit.value) return
    await store.add({ title: draftTitle.value, priority: draftPriority.value })
    draftTitle.value = ''
    draftPriority.value = 'medium'
  }

  function setFilter(next: TaskFilter) {
    filter.value = next
  }

  onMounted(() => {
    if (tasks.value.length === 0) store.load()
  })

  return {
    loading,
    error,
    filter,
    draftTitle,
    draftPriority,
    visibleTasks,
    stats,
    canSubmit,
    submitDraft,
    setFilter,
    toggle: store.toggle,
    remove: store.remove,
    clearCompleted: store.clearCompleted,
  }
}
