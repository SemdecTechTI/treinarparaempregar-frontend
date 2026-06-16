<template>
  <div class="space-y-4">
    <div>
      <label class="form-label">Título</label>
      <input v-model="form.titulo" type="text" required class="input-modern" />
    </div>

    <div>
      <label class="form-label">Descrição</label>
      <textarea v-model="form.descricao" rows="3" class="input-modern" />
    </div>

    <AdminImageUploadField
      v-model="form.capa"
      label="Capa"
      hint="Imagem exibida na listagem do acervo."
      context="acervo_cover"
    />

    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label class="form-label">Ordem</label>
        <input v-model.number="form.ordem" type="number" min="0" class="input-modern" />
      </div>
      <div class="flex items-end">
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.ativo" type="checkbox" />
          Acervo ativo (visível para cidadãos)
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ form: Record<string, any> }>()
</script>
