<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import {
  PhListChecks as ListChecks,
  PhChartBar as ChartBar,
  PhMoon as Moon,
  PhSun as Sun,
} from '@phosphor-icons/vue'
import { Button } from '@/shared/ui/button'

const nav = [
  { to: '/tasks', label: 'Tarefas', icon: ListChecks },
  { to: '/dashboard', label: 'Dashboard', icon: ChartBar },
]

const isDark = ref(false)
function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div class="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4">
        <div class="flex items-center gap-6">
          <span class="text-sm font-bold tracking-tight">FDD · MVVM Lab</span>
          <nav class="flex items-center gap-1">
            <RouterLink
              v-for="item in nav"
              :key="item.to"
              v-slot="{ isActive, navigate }"
              :to="item.to"
              custom
            >
              <Button :variant="isActive ? 'secondary' : 'ghost'" size="sm" @click="navigate">
                <component :is="item.icon" :size="16" weight="bold" />
                {{ item.label }}
              </Button>
            </RouterLink>
          </nav>
        </div>
        <Button variant="ghost" size="icon" class="h-8 w-8" @click="toggleTheme">
          <component :is="isDark ? Sun : Moon" :size="16" />
        </Button>
      </div>
    </header>

    <main class="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
