<template>
  <div class="relative" ref="root">
    <label v-if="label" class="form-label">{{ label }}</label>

    <div class="flex gap-2">
      <div class="relative flex-1 min-w-0">
        <input
          v-model="query"
          type="search"
          class="input-modern w-full"
          :placeholder="placeholder"
          autocomplete="off"
          @focus="open = true"
          @keydown.escape="open = false"
          @keydown.enter.prevent="pickFirst"
        />
        <p v-if="selected" class="text-xs text-muted mt-1 truncate">
          Selecionado: <strong class="text-primary">{{ selected.name }}</strong>
        </p>
      </div>
      <button type="button" class="btn btn-outline text-sm py-2 shrink-0 whitespace-nowrap" @click="showCreate = !showCreate">
        + Novo
      </button>
    </div>

    <div
      v-if="open && filtered.length"
      class="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg"
    >
      <button
        v-for="p in filtered"
        :key="p.id"
        type="button"
        class="w-full text-left px-3 py-2 text-sm hover:bg-primary/5"
        :class="String(p.id) === String(modelValue) ? 'bg-primary/10 font-medium' : ''"
        @mousedown.prevent="select(p)"
      >
        {{ p.name }}
      </button>
    </div>
    <p v-else-if="open && query.trim() && !filtered.length" class="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow px-3 py-2 text-sm text-muted">
      Nenhum parceiro encontrado. Use “+ Novo” para cadastrar.
    </p>

    <div v-if="showCreate" class="mt-3 rounded-lg border border-dashed border-gray-300 p-3 space-y-2 bg-surface/50">
      <p class="text-sm font-medium text-primary">Adicionar parceiro</p>
      <input
        v-model="newName"
        type="text"
        class="input-modern"
        placeholder="Nome do parceiro"
        @keyup.enter="createPartner"
      />
      <p v-if="createError" class="text-xs text-red-600">{{ createError }}</p>
      <div class="flex flex-wrap gap-2">
        <button type="button" class="btn text-sm py-1.5" :disabled="creating" @click="createPartner">
          {{ creating ? 'Salvando...' : 'Criar e selecionar' }}
        </button>
        <button type="button" class="btn btn-outline text-sm py-1.5" @click="showCreate = false">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string | number | null | undefined
    partners: Array<{ id: number; name: string }>
    label?: string
    placeholder?: string
  }>(),
  {
    label: 'Parceiro',
    placeholder: 'Buscar parceiro...',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'partner-created': [partner: { id: number; name: string }]
  'partners-refresh': []
}>()

const query = ref('')
const open = ref(false)
const showCreate = ref(false)
const newName = ref('')
const creating = ref(false)
const createError = ref('')
const root = ref<HTMLElement | null>(null)

const selected = computed(() =>
  props.partners.find(p => String(p.id) === String(props.modelValue)) || null,
)

watch(selected, (s) => {
  if (s && !open.value) query.value = s.name
}, { immediate: true })

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.partners.slice(0, 50)
  return props.partners.filter(p => p.name.toLowerCase().includes(q)).slice(0, 50)
})

function select(p: { id: number; name: string }) {
  emit('update:modelValue', String(p.id))
  query.value = p.name
  open.value = false
}

function pickFirst() {
  if (filtered.value[0]) select(filtered.value[0])
}

async function createPartner() {
  createError.value = ''
  const name = newName.value.trim()
  if (!name) {
    createError.value = 'Informe o nome do parceiro.'
    return
  }

  creating.value = true
  try {
    const res = await useApi<{ partner: { id: number; name: string }; created: boolean; message?: string }>(
      '/admin/partners/find-or-create',
      { method: 'POST', body: { name } },
    )
    emit('partner-created', res.partner)
    emit('partners-refresh')
    select(res.partner)
    showCreate.value = false
    newName.value = ''
  } catch (e: any) {
    createError.value = e?.data?.message || 'Não foi possível criar o parceiro.'
  } finally {
    creating.value = false
  }
}

function onDocClick(e: MouseEvent) {
  if (!root.value?.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>
