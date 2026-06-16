<template>
  <div class="flex flex-wrap items-center gap-2">
    <button
      v-for="opt in options"
      :key="String(opt.value)"
      type="button"
      class="pill"
      :class="{ 'pill-active': model === opt.value }"
      @click="model = opt.value"
    >
      <span v-if="opt.icon" class="text-base">{{ opt.icon }}</span>
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label: string
  value: string
  icon?: string
}

defineProps<{ options: Option[] }>()
const model = defineModel<string>({ default: '' })
</script>
