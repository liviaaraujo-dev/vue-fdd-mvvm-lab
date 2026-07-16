<script setup lang="ts">
import { PhChartBar as ChartBar } from '@phosphor-icons/vue'
import { Card, CardContent, CardDescription, CardTitle } from '@/shared/ui/card'
import { useDashboardViewModel } from '../viewmodels/useDashboardViewModel'

const vm = useDashboardViewModel()
</script>

<template>
  <div class="mx-auto flex w-full max-w-3xl flex-col gap-6">
    <header class="flex items-center gap-3">
      <ChartBar :size="28" weight="duotone" />
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p class="text-sm text-muted-foreground">
          Feature que lê a store pública de <code>tasks</code> sem acoplar internamente.
        </p>
      </div>
    </header>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <Card v-for="c in vm.cards.value" :key="c.label">
        <CardContent class="flex flex-col gap-1 pt-6">
          <CardTitle class="text-3xl">{{ c.value }}</CardTitle>
          <CardDescription>{{ c.label }}</CardDescription>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
