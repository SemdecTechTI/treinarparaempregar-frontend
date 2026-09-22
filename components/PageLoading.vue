<template>
  <div role="status" aria-live="polite" aria-label="Carregando">
    <span class="sr-only">Carregando</span>

    <div v-if="variant === 'form'" class="w-full max-w-4xl mx-auto space-y-6">
      <div class="bg-white rounded-lg shadow p-6 space-y-5">
        <div class="skeleton h-4 w-32" />
        <div class="grid md:grid-cols-2 gap-4">
          <div class="skeleton h-11" />
          <div class="skeleton h-11" />
        </div>
        <div class="skeleton h-11" />
        <div class="skeleton h-28" />
      </div>
      <div class="bg-white rounded-lg shadow p-6 space-y-4">
        <div class="skeleton h-4 w-24" />
        <div class="grid md:grid-cols-2 gap-4">
          <div class="skeleton h-11" />
          <div class="skeleton h-11" />
        </div>
        <div class="flex gap-3 pt-2">
          <div class="skeleton h-10 w-28" />
          <div class="skeleton h-10 w-24" />
        </div>
      </div>
    </div>

    <div v-else-if="variant === 'table'" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="bg-gray-50 px-4 py-3 flex gap-4">
        <div v-for="n in columns" :key="`h-${n}`" class="skeleton h-3 flex-1 max-w-[8rem]" />
      </div>
      <div
        v-for="row in rows"
        :key="`r-${row}`"
        class="px-4 py-4 border-t border-gray-100 flex items-center gap-4"
      >
        <div v-for="n in columns" :key="`c-${row}-${n}`" class="skeleton h-3 flex-1" />
      </div>
    </div>

    <div v-else-if="variant === 'detail'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div v-for="card in 2" :key="card" class="bg-white rounded-lg shadow p-6 space-y-4">
        <div class="skeleton h-4 w-40" />
        <div v-for="n in 5" :key="n" class="space-y-2">
          <div class="skeleton h-2.5 w-20" />
          <div class="skeleton h-3.5 w-full max-w-xs" />
        </div>
      </div>
    </div>

    <div v-else-if="variant === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in rows" :key="n" class="skeleton h-80 rounded-2xl" />
    </div>

    <div v-else-if="variant === 'list'" class="space-y-3">
      <div v-for="n in rows" :key="n" class="skeleton h-16 rounded-xl" />
    </div>

    <div v-else-if="variant === 'media'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <div class="skeleton h-4 w-48" />
        <div class="skeleton aspect-video w-full rounded-2xl" />
        <div class="skeleton h-6 w-2/3" />
        <div class="skeleton h-3 w-full" />
      </div>
      <div class="space-y-3">
        <div class="skeleton h-4 w-28" />
        <div v-for="n in 4" :key="n" class="skeleton h-16 rounded-xl" />
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-16">
      <div class="w-full max-w-xl space-y-4">
        <div class="skeleton h-8 w-48 mx-auto" />
        <div class="skeleton h-64 w-full rounded-2xl" />
        <div class="skeleton h-3 w-40 mx-auto" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'form' | 'table' | 'detail' | 'cards' | 'list' | 'media' | 'page'
    rows?: number
    columns?: number
  }>(),
  {
    variant: 'form',
    rows: 6,
    columns: 5,
  },
)
</script>
