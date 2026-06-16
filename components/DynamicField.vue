<template>
  <div class="space-y-1">
    <label v-if="field.label" class="block text-sm font-medium text-text">
      {{ field.label }}
      <span v-if="field.required" class="text-red-500">*</span>
    </label>

    <input
      v-if="field.type === 'text' || field.type === 'number' || field.type === 'date'"
      :type="field.type"
      v-model="model"
      class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white transition-all outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
      :required="field.required"
    />

    <textarea
      v-else-if="field.type === 'textarea'"
      v-model="model"
      rows="3"
      class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white transition-all outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
      :required="field.required"
    />

    <select
      v-else-if="field.type === 'select'"
      v-model="model"
      class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white transition-all outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
      :required="field.required"
    >
      <option value="">Selecione...</option>
      <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
    </select>

    <div v-else-if="field.type === 'radio'" class="flex flex-wrap gap-4">
      <label v-for="opt in field.options" :key="opt" class="flex items-center gap-2 text-sm">
        <input type="radio" :value="opt" v-model="model" :required="field.required" />
        {{ opt }}
      </label>
    </div>

    <label v-else-if="field.type === 'checkbox'" class="flex items-center gap-2 text-sm">
      <input type="checkbox" v-model="model" true-value="Sim" false-value="Não" />
      {{ field.label }}
    </label>
  </div>
</template>

<script setup lang="ts">
interface CustomField {
  id: number
  label: string
  type: string
  options?: string[]
  required?: boolean
}

const props = defineProps<{ field: CustomField }>()
const model = defineModel<string>({ default: '' })
</script>
