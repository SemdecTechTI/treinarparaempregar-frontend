<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="open = false">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 lg:p-8 shadow-2xl border border-gray-100 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <h2 class="text-xl font-semibold text-primary mb-2">Vagas esgotadas</h2>
        <p class="text-text text-sm mb-6">
          As vagas para o curso <strong>{{ title }}</strong> estão esgotadas. Tente novamente mais tarde ou escolha outro curso disponível.
        </p>
        <div class="flex gap-3 justify-center">
          <button class="btn" @click="open = false">Entendi</button>
          <NuxtLink to="/" class="btn bg-accent hover:bg-accent/90">Ver outros cursos</NuxtLink>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })
defineProps<{ title: string }>()
</script>
