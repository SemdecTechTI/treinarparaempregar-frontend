<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 class="font-semibold text-primary">Conteúdo</h2>

      <div>
        <label class="form-label">Título</label>
        <input v-model="form.titulo" type="text" required class="input-modern" />
      </div>

      <div>
        <label class="form-label">Resumo (excerpt)</label>
        <textarea v-model="form.excerpt" rows="2" class="input-modern" placeholder="Texto curto para cards e listagens" />
      </div>

      <div>
        <label class="form-label">Conteúdo</label>
        <ClientOnly>
          <AdminRichTextEditor v-model="form.content" />
          <template #fallback>
            <div class="skeleton h-72 rounded-xl" />
          </template>
        </ClientOnly>
        <p class="text-xs text-muted mt-2">Use a barra de ferramentas para formatar texto, listas, títulos e links.</p>
      </div>

      <AdminImageUploadField
        v-model="form.cover_image"
        label="Imagem de capa"
        hint="Exibida no blog, cards e compartilhamento social."
        context="blog_cover"
      />
    </div>

    <div class="bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-4">
      <h2 class="md:col-span-2 font-semibold text-primary">Publicação</h2>

      <div>
        <label class="form-label">Status</label>
        <select v-model="form.status" class="input-modern">
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
        </select>
      </div>

      <div>
        <label class="form-label">Data de publicação</label>
        <input v-model="form.published_at" type="datetime-local" class="input-modern" />
        <p class="text-xs text-muted mt-1">Obrigatório para publicar no site.</p>
      </div>

      <div>
        <label class="form-label">Ordem</label>
        <input v-model.number="form.ordem" type="number" min="0" class="input-modern" />
      </div>

      <div class="flex items-end">
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.featured" type="checkbox" />
          Destaque na página do blog
        </label>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 class="font-semibold text-primary">SEO</h2>
      <p class="text-sm text-muted">Campos opcionais para melhorar busca e compartilhamento.</p>

      <div>
        <label class="form-label">Meta title</label>
        <input v-model="form.meta_title" type="text" class="input-modern" placeholder="Título para Google (até 60 caracteres)" />
      </div>

      <div>
        <label class="form-label">Meta description</label>
        <textarea v-model="form.meta_description" rows="2" class="input-modern" placeholder="Descrição para busca (até 160 caracteres)" maxlength="320" />
      </div>

      <AdminImageUploadField
        v-model="form.og_image"
        label="Imagem Open Graph"
        hint="Usada ao compartilhar no WhatsApp/redes. Se vazio, usa a capa."
        context="blog_cover"
      />

      <div>
        <label class="form-label">URL canônica</label>
        <input v-model="form.canonical_url" type="url" class="input-modern" placeholder="https://..." />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ form: Record<string, any> }>()
</script>
