<script setup lang="ts">
import { PhTrash as Trash } from '@phosphor-icons/vue'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { PRIORITY_LABEL } from '../domain/task.entity'
import type { Task } from '../domain/task.types'

defineProps<{ task: Task }>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'remove', id: string): void
}>()

const priorityVariant = {
  high: 'destructive',
  medium: 'default',
  low: 'secondary',
} as const
</script>

<template>
  <div
    class="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 transition-colors hover:bg-accent/40"
  >
    <Checkbox
      :model-value="task.done"
      @update:model-value="emit('toggle', task.id)"
    />
    <span
      class="flex-1 text-sm"
      :class="task.done ? 'text-muted-foreground line-through' : ''"
    >
      {{ task.title }}
    </span>
    <Badge :variant="priorityVariant[task.priority]">
      {{ PRIORITY_LABEL[task.priority] }}
    </Badge>
    <Button variant="ghost" size="icon" class="h-8 w-8" @click="emit('remove', task.id)">
      <Trash :size="16" />
    </Button>
  </div>
</template>
