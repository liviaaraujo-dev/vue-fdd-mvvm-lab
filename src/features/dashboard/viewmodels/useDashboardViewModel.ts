import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/features/tasks'

export function useDashboardViewModel() {
  const store = useTaskStore()
  const { tasks, loading } = storeToRefs(store)

  const cards = computed(() => {
    const total = tasks.value.length
    const done = tasks.value.filter((t) => t.done).length
    const high = tasks.value.filter((t) => !t.done && t.priority === 'high').length
    return [
      { label: 'Total de tarefas', value: total },
      { label: 'Concluídas', value: done },
      { label: 'Pendentes', value: total - done },
      { label: 'Alta prioridade', value: high },
    ]
  })

  onMounted(() => {
    if (tasks.value.length === 0) store.load()
  })

  return { cards, loading }
}
