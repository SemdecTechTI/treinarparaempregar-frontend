<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-4">
      <h2 class="md:col-span-2 font-semibold text-primary">Informações do curso</h2>

      <div class="md:col-span-2">
        <label class="form-label">Título</label>
        <input v-model="form.titulo" type="text" required class="input-modern" />
      </div>

      <div>
        <label class="form-label">Parceiro</label>
        <select v-model="form.partner_id" required class="input-modern">
          <option v-if="!partners.length" value="" disabled>Carregando parceiros...</option>
          <option v-for="p in partners" :key="p.id" :value="String(p.id)">{{ p.name }}</option>
        </select>
      </div>

      <div>
        <label class="form-label">Trilha</label>
        <select v-model="form.trilha" class="input-modern">
          <option value="base">Base (SIMM Prepara)</option>
          <option value="saude">Saúde</option>
          <option value="servicos">Serviços</option>
          <option value="tecnicos">Construção Civil</option>
        </select>
      </div>

      <div>
        <label class="form-label">Carga horária</label>
        <input v-model="form.carga_horaria" type="text" class="input-modern" placeholder="Ex: 4H - 13:00 às 17:00" />
      </div>

      <div>
        <label class="form-label">Link para inscrição</label>
        <input v-model="form.link_inscricao" type="url" class="input-modern" placeholder="https://..." />
        <p class="text-xs text-muted mt-1">Opcional. Redireciona o cidadão após confirmar a inscrição.</p>
      </div>

      <div class="md:col-span-2">
        <label class="form-label">Resumo</label>
        <textarea v-model="form.resumo" rows="2" class="input-modern" placeholder="Texto curto exibido em listagens" />
      </div>

      <div class="md:col-span-2">
        <label class="form-label">Descrição</label>
        <textarea v-model="form.descricao" rows="5" class="input-modern" />
      </div>

      <div>
        <label class="form-label">Modalidade</label>
        <select v-model="form.modalidade" class="input-modern">
          <option value="presencial">Presencial</option>
          <option value="ead">EAD</option>
        </select>
      </div>

      <div>
        <label class="form-label">Ordem</label>
        <input v-model.number="form.ordem" type="number" min="0" class="input-modern" />
        <p class="text-xs text-muted mt-1">Menor número aparece primeiro na listagem.</p>
      </div>

      <div>
        <AdminImageUploadField
          v-model="form.imagem"
          label="Imagem do curso"
          hint="Imagem exibida nas listagens e cards do curso."
          context="course_image"
        />
      </div>

      <div>
        <label class="form-label">Quantidade de vagas</label>
        <input v-model.number="form.vagas_totais" type="number" min="0" class="input-modern" />
        <p class="text-xs text-muted mt-1">Zero = vagas ilimitadas.</p>
        <div class="mt-3 space-y-2">
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.ocultar_vagas_totais" type="checkbox" />
            Ocultar vagas totais no site
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.ocultar_vagas_disponiveis" type="checkbox" />
            Ocultar vagas disponíveis no site
          </label>
        </div>
      </div>

      <div>
        <label class="form-label">Data do curso</label>
        <input v-model="form.data_curso" type="date" class="input-modern" />
      </div>

      <div class="md:col-span-2">
        <label class="form-label">Local</label>
        <input v-model="form.local" type="text" class="input-modern" />
      </div>

      <label class="flex items-center gap-2 text-sm md:col-span-2">
        <input v-model="form.ativo" type="checkbox" />
        Curso ativo (visível no site)
      </label>
    </div>

    <div v-if="showEnrollment" class="bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-4">
      <h2 class="md:col-span-2 font-semibold text-primary">Inscrições</h2>
      <div>
        <label class="form-label">Início das inscrições</label>
        <input v-model="form.inscricao_inicio" type="datetime-local" class="input-modern" />
      </div>
      <div>
        <label class="form-label">Fim das inscrições</label>
        <input v-model="form.inscricao_fim" type="datetime-local" class="input-modern" />
      </div>
      <div class="md:col-span-2 flex flex-wrap gap-4">
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.inscricao_encerrada" type="checkbox" />
          Encerrar inscrições manualmente
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.permite_inscricao_simultanea" type="checkbox" />
          Permitir inscrição simultânea em outros cursos abertos
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.exige_documentos" type="checkbox" />
          Exigir envio de documentos na inscrição
        </label>
      </div>
      <div v-if="form.exige_documentos" class="md:col-span-2">
        <p class="form-label mb-2">Documentos necessários</p>
        <p v-if="!Object.keys(documentTypes).length" class="text-sm text-muted">Nenhum tipo de documento configurado.</p>
        <div class="grid sm:grid-cols-2 gap-2">
          <label v-for="(label, key) in documentTypes" :key="key" class="flex items-center gap-2 text-sm">
            <input type="checkbox" :value="key" v-model="selectedDocs" />
            {{ label }}
          </label>
        </div>
      </div>
    </div>

    <AdminCourseCustomFieldsPanel
      v-if="showEnrollment"
      :course-id="courseId"
      v-model:pending="pendingCustomFields"
    />
  </div>
</template>

<script setup lang="ts">
import type { CourseCustomFieldDraft } from '~/types/custom-field'

const props = withDefaults(
  defineProps<{
    form: Record<string, any>
    partners: any[]
    documentTypes: Record<string, string>
    showEnrollment?: boolean
    courseId?: number | null
  }>(),
  { showEnrollment: false, courseId: null },
)

const selectedDocs = defineModel<string[]>('selectedDocs', { default: () => [] })
const pendingCustomFields = defineModel<CourseCustomFieldDraft[]>('pendingCustomFields', { default: () => [] })
</script>
