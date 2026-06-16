<template>
  <div class="space-y-6">
    <div>
      <label class="form-label">Título</label>
      <input v-model="form.title" type="text" required class="input-modern" />
    </div>
    <div>
      <label class="form-label">Descrição</label>
      <textarea v-model="form.description" rows="4" class="input-modern" />
    </div>
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label class="form-label">Status</label>
        <select v-model="form.status" class="input-modern">
          <option value="draft">Rascunho</option>
          <option value="active">Ativo</option>
          <option value="archived">Arquivado</option>
        </select>
      </div>
      <div>
        <label class="form-label">Máximo de respostas</label>
        <input v-model.number="form.max_responses" type="number" min="1" class="input-modern" placeholder="Ilimitado" />
      </div>
    </div>
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label class="form-label">Início das respostas</label>
        <input v-model="form.start_datetime" type="datetime-local" class="input-modern" />
      </div>
      <div>
        <label class="form-label">Fim das respostas</label>
        <input v-model="form.end_datetime" type="datetime-local" class="input-modern" />
      </div>
    </div>
    <div class="space-y-3">
      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.is_anonymous" type="checkbox" />
        Formulário anônimo (sem nome/e-mail)
      </label>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.unique_submission" type="checkbox" />
        Permitir apenas uma resposta por identificador
      </label>
      <div v-if="form.unique_submission" class="pl-6">
        <label class="form-label">Identificador único</label>
        <select v-model="form.unique_key_type" class="input-modern w-auto min-w-[200px]">
          <option value="email">E-mail</option>
          <option value="cpf">CPF</option>
        </select>
      </div>
    </div>
    <div class="border-t pt-4 space-y-3">
      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.custom_public_slug" type="checkbox" />
        Definir link personalizado (slug)
      </label>
      <div v-if="form.custom_public_slug">
        <label class="form-label">Slug do link público</label>
        <input v-model="form.slug_custom" type="text" class="input-modern" placeholder="meu-formulario" />
        <p class="text-xs text-muted mt-1">URL: /formulario/{{ form.slug_custom || '...' }}</p>
      </div>
      <p v-else class="text-xs text-muted">Um identificador automático será gerado para o link público.</p>
    </div>
    <div>
      <AdminImageUploadField
        v-model="form.background_url"
        label="Imagem de fundo (opcional)"
        hint="Exibida na página pública do formulário."
        context="form_background"
      />
      <label v-if="form.background_url" class="flex items-center gap-2 text-sm mt-2">
        <input v-model="form.remove_background" type="checkbox" />
        Remover imagem de fundo
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ form: Record<string, any> }>()
</script>
