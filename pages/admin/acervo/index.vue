<template>
  <div>
    <AdminHeader title="Acervo">
      <AdminActionButton to="/admin/acervo/novo" label="+ Novo acervo" variant="primary" size="md" />
    </AdminHeader>

    <div v-if="loadError" class="text-red-600 text-sm mb-4">{{ loadError }}</div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Título</th>
            <th class="px-4 py-3 text-left">Vídeos</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!acervos.length" class="border-t">
            <td colspan="4" class="px-4 py-6 text-center text-muted">Nenhum acervo cadastrado.</td>
          </tr>
          <tr v-for="item in acervos" :key="item.id" class="border-t">
            <td class="px-4 py-3">
              <p class="font-medium text-primary">{{ item.titulo }}</p>
              <p class="text-xs text-muted">{{ item.slug }}</p>
            </td>
            <td class="px-4 py-3">{{ item.videos_count ?? 0 }}</td>
            <td class="px-4 py-3">
              <span
                class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                :class="item.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
              >
                {{ item.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <AdminRowActionsMenu :items="[
                { label: 'Gerenciar', onClick: () => navigateTo(`/admin/acervo/${item.id}`) },
                { label: 'Remover', danger: true, onClick: () => remove(item) },
              ]" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const acervos = ref<any[]>([])
const loadError = ref('')
const dialog = useDialog()

async function load() {
  try {
    acervos.value = await useApi<any[]>('/admin/acervos')
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao carregar acervos.'
  }
}

async function remove(item: any) {
  if (!await dialog.confirm(`Remover o acervo "${item.titulo}"?`, {
    title: 'Remover acervo',
    confirmText: 'Remover',
    danger: true,
  })) return
  try {
    await useApi(`/admin/acervos/${item.id}`, { method: 'DELETE' })
    await load()
  } catch (e: any) {
    loadError.value = e?.data?.message || 'Erro ao remover.'
  }
}

onMounted(load)
</script>
