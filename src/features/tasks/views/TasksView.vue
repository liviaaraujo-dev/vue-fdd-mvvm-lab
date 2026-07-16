<script setup lang="ts">
import {
  PhPlus as Plus,
  PhCheckCircle as CheckCircle,
  PhBroom as Broom,
} from '@phosphor-icons/vue'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Badge } from '@/shared/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import type { TaskFilter, TaskPriority } from '../domain/task.types'
import TaskItem from '../components/TaskItem.vue'
import { useTaskListViewModel } from '../viewmodels/useTaskListViewModel'

const vm = useTaskListViewModel()

const filters: { label: string; value: TaskFilter }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Ativas', value: 'active' },
  { label: 'Concluídas', value: 'done' },
]

const priorities: { label: string; value: TaskPriority }[] = [
  { label: 'Baixa', value: 'low' },
  { label: 'Média', value: 'medium' },
  { label: 'Alta', value: 'high' },
]
</script>

<template>
  <div class="mx-auto flex w-full max-w-2xl flex-col gap-6">
    <header class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold tracking-tight">Tarefas</h1>
      <p class="text-sm text-muted-foreground">
        Feature isolada demonstrando domain → data → store → viewmodel → view.
      </p>
    </header>

    <!-- Progresso -->
    <Card>
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Progresso</CardTitle>
            <CardDescription>
              {{ vm.stats.value.done }} de {{ vm.stats.value.total }} concluídas
            </CardDescription>
          </div>
          <Badge variant="success" class="text-sm">
            {{ vm.stats.value.progress }}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div class="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            class="h-full rounded-full bg-primary transition-all duration-500"
            :style="{ width: `${vm.stats.value.progress}%` }"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Formulário -->
    <Card>
      <CardContent class="flex flex-col gap-3 pt-6">
        <div class="flex gap-2">
          <Input
            v-model="vm.draftTitle.value"
            placeholder="Nova tarefa..."
            @keyup.enter="vm.submitDraft"
          />
          <Button :disabled="!vm.canSubmit.value" @click="vm.submitDraft">
            <Plus :size="16" weight="bold" />
            Adicionar
          </Button>
        </div>
        <div class="flex gap-2">
          <Button
            v-for="p in priorities"
            :key="p.value"
            size="sm"
            :variant="vm.draftPriority.value === p.value ? 'default' : 'outline'"
            @click="vm.draftPriority.value = p.value"
          >
            {{ p.label }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Filtros + lista -->
    <div class="flex items-center justify-between">
      <div class="flex gap-1 rounded-lg border bg-card p-1">
        <Button
          v-for="f in filters"
          :key="f.value"
          size="sm"
          :variant="vm.filter.value === f.value ? 'secondary' : 'ghost'"
          @click="vm.setFilter(f.value)"
        >
          {{ f.label }}
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        :disabled="vm.stats.value.done === 0"
        @click="vm.clearCompleted"
      >
        <Broom :size="16" />
        Limpar concluídas
      </Button>
    </div>

    <div v-if="vm.loading.value" class="py-10 text-center text-sm text-muted-foreground">
      Carregando tarefas...
    </div>

    <div
      v-else-if="vm.visibleTasks.value.length === 0"
      class="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground"
    >
      <CheckCircle :size="40" weight="thin" />
      <p class="text-sm">Nenhuma tarefa por aqui.</p>
    </div>

    <div v-else class="flex flex-col gap-2">
      <TaskItem
        v-for="task in vm.visibleTasks.value"
        :key="task.id"
        :task="task"
        @toggle="vm.toggle"
        @remove="vm.remove"
      />
    </div>

    <p v-if="vm.error.value" class="text-sm text-destructive">{{ vm.error.value }}</p>
  </div>
</template>
