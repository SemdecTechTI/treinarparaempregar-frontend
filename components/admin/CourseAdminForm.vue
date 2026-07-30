<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-4">
      <h2 class="md:col-span-2 font-semibold text-primary">Informações do curso</h2>

      <div class="md:col-span-2">
        <label class="form-label">Título</label>
        <input v-model="form.title" type="text" required class="input-modern" />
        <p class="text-xs text-muted mt-1">Nome público do curso.</p>
      </div>

      <div class="md:col-span-2">
        <label class="form-label">Título interno</label>
        <input v-model="form.internal_title" type="text" class="input-modern" placeholder="Ex.: Público geral, Parceiro..." />
      </div>

      <div>
        <AdminPartnerSearchSelect
          v-model="form.partner_id"
          :partners="partners"
          @partner-created="onPartnerCreated"
        />
      </div>

      <div>
        <label class="form-label">Trilha</label>
        <select v-model="form.track" required class="input-modern">
          <option v-if="!trackOptions.length" value="" disabled>Carregando trilhas...</option>
          <option v-for="t in trackOptions" :key="t.slug" :value="t.slug">{{ t.name }}</option>
        </select>
        <p class="text-xs text-muted mt-1">Cadastre novas trilhas em Admin → Trilhas.</p>
      </div>

      <div>
        <label class="form-label">Carga horária</label>
        <input v-model="form.workload" type="text" class="input-modern" placeholder="Ex: 4H - 13:00 às 17:00" />
      </div>

      <div>
        <label class="form-label">Link para inscrição</label>
        <input v-model="form.enrollment_link" type="url" class="input-modern" placeholder="https://..." />
        <p class="text-xs text-muted mt-1">Opcional. Redireciona o cidadão após confirmar a inscrição.</p>
      </div>

      <div class="md:col-span-2">
        <label class="form-label">Resumo</label>
        <textarea v-model="form.summary" rows="2" class="input-modern" placeholder="Texto curto exibido em listagens" />
      </div>

      <div class="md:col-span-2">
        <label class="form-label">Descrição</label>
        <textarea v-model="form.description" rows="5" class="input-modern" />
      </div>

      <div>
        <label class="form-label">Modalidade</label>
        <select v-model="form.modality" class="input-modern">
          <option value="presencial">Presencial</option>
          <option value="online">Online (vídeos no portal)</option>
          <option value="ead">EAD (plataforma do parceiro)</option>
        </select>
      </div>

      <div>
        <label class="form-label">Ordem</label>
        <input v-model.number="form.sort_order" type="number" min="0" class="input-modern" />
        <p class="text-xs text-muted mt-1">Menor número aparece primeiro na listagem.</p>
      </div>

      <div>
        <AdminImageUploadField
          v-model="form.image"
          label="Imagem do curso"
          hint="Imagem exibida nas listagens e cards do curso."
          context="course_image"
        />
      </div>

      <div>
        <label class="form-label">Quantidade de vagas</label>
        <input v-model.number="form.total_vacancies" type="number" min="0" class="input-modern" />
        <p class="text-xs text-muted mt-1">Zero = vagas ilimitadas.</p>
        <label class="form-label mt-3">Vagas de reserva</label>
        <input v-model.number="form.reserve_vacancies" type="number" min="0" class="input-modern" />
        <p class="text-xs text-muted mt-1">
          Quando as vagas regulares esgotarem, as inscrições continuam até esse limite e o cidadão é informado de que entrou na lista de reserva. Zero = sem reserva.
        </p>
        <div class="mt-3 space-y-2">
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.hide_total_vacancies" type="checkbox" />
            Ocultar vagas totais no site
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.hide_available_vacancies" type="checkbox" />
            Ocultar vagas disponíveis no site
          </label>
        </div>
      </div>

      <div>
        <label class="form-label">Início do curso</label>
        <input v-model="form.course_start_date" type="date" class="input-modern" />
      </div>

      <div>
        <label class="form-label">Fim do curso</label>
        <input v-model="form.course_end_date" type="date" class="input-modern" />
      </div>

      <div class="md:col-span-2">
        <label class="form-label">Local</label>
        <input v-model="form.location" type="text" class="input-modern" />
      </div>

      <label class="flex items-center gap-2 text-sm md:col-span-2">
        <input v-model="form.listed" type="checkbox" />
        Listado no site
      </label>
      <p class="text-xs text-muted md:col-span-2 -mt-4">
        Se desmarcado, o curso não aparece na listagem pública, mas a URL direta continua funcionando enquanto o curso estiver ativo.
      </p>

      <label class="flex items-center gap-2 text-sm md:col-span-2">
        <input v-model="form.women_only" type="checkbox" />
        Exclusivo para mulheres
      </label>
      <p class="text-xs text-muted md:col-span-2 -mt-4">
        Visitantes veem o curso normalmente. Quem estiver logado só acessa se a identidade de gênero for Mulher cisgênero ou Mulher trans.
      </p>

      <label class="flex items-center gap-2 text-sm md:col-span-2">
        <input v-model="form.adults_only" type="checkbox" />
        Somente maiores de 18 anos
      </label>
      <p class="text-xs text-muted md:col-span-2 -mt-4">
        O curso continua listado e acessível pelo link. Menores de 18 anos não conseguem se inscrever.
      </p>

      <div class="md:col-span-2 border-t pt-4 mt-2 space-y-3">
        <h3 class="font-semibold text-primary text-sm">Vínculo para exportação</h3>
        <p class="text-xs text-muted">
          Cursos vinculados exportam os inscritos juntos. A coluna “Título interno” diferencia cada turma no arquivo.
        </p>

        <div v-if="linkedCourses.length" class="rounded-lg bg-surface px-3 py-2 text-sm space-y-1">
          <p class="font-medium text-primary">Já vinculado com:</p>
          <ul class="list-disc list-inside text-muted">
            <li v-for="c in linkedCourses" :key="c.id">
              {{ c.internal_title || c.title }}
              <span v-if="c.internal_title && c.title !== c.internal_title" class="text-xs">({{ c.title }})</span>
            </li>
          </ul>
          <label class="flex items-center gap-2 text-sm pt-2">
            <input v-model="form.keep_export_link" type="checkbox" />
            Manter vínculo na exportação
          </label>
        </div>

        <div v-else-if="linkSource" class="rounded-lg bg-surface px-3 py-2 space-y-2">
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.keep_export_link" type="checkbox" />
            Vincular exportação com
            <strong>{{ linkSource.internal_title || linkSource.title }}</strong>
          </label>
          <p class="text-xs text-muted">
            Desmarque se esta cópia não deve entrar no mesmo arquivo de inscritos do curso original.
          </p>
        </div>

        <div v-if="!linkedCourses.length && !linkSource && courseOptions.length">
          <label class="form-label">Vincular a outro curso</label>
          <select v-model="form.link_course_id" class="input-modern">
            <option value="">Não vincular</option>
            <option v-for="c in courseOptions" :key="c.id" :value="String(c.id)">
              {{ c.internal_title ? `${c.internal_title} — ${c.title}` : c.title }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="showEnrollment" class="bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-4">
      <h2 class="md:col-span-2 font-semibold text-primary">Inscrições</h2>
      <div>
        <label class="form-label">Início das inscrições</label>
        <input v-model="form.enrollment_start" type="datetime-local" class="input-modern" />
      </div>
      <div>
        <label class="form-label">Fim das inscrições</label>
        <input v-model="form.enrollment_end" type="datetime-local" class="input-modern" />
        <p class="text-xs text-muted mt-1">Deixe em branco para inscrição sem prazo (comum em cursos online).</p>
      </div>
      <div class="md:col-span-2 flex flex-wrap gap-4">
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.enrollment_closed" type="checkbox" />
          Encerrar inscrições manualmente
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.allow_simultaneous_enrollment" type="checkbox" />
          Permitir inscrição simultânea em outros cursos abertos
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.requires_documents" type="checkbox" />
          Exigir envio de documentos na inscrição
        </label>
      </div>
      <div v-if="form.requires_documents" class="md:col-span-2">
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
    tracks?: Array<{ id?: number; name: string; slug: string; active?: boolean }>
    documentTypes: Record<string, string>
    showEnrollment?: boolean
    courseId?: number | null
    linkedCourses?: Array<{ id: number; title: string; internal_title?: string | null }>
    courseOptions?: Array<{ id: number; title: string; internal_title?: string | null }>
    linkSource?: { id: number; title: string; internal_title?: string | null } | null
  }>(),
  {
    showEnrollment: false,
    courseId: null,
    tracks: () => [],
    linkedCourses: () => [],
    courseOptions: () => [],
    linkSource: null,
  },
)

const emit = defineEmits<{
  'partner-created': [partner: { id: number; name: string }]
}>()

function onPartnerCreated(partner: { id: number; name: string }) {
  emit('partner-created', partner)
}

const trackOptions = computed(() => {
  const list = props.tracks.filter(t => t.active !== false || t.slug === props.form.track)
  if (props.form.track && !list.some(t => t.slug === props.form.track)) {
    return [...list, { name: props.form.track, slug: props.form.track }]
  }
  return list
})

const selectedDocs = defineModel<string[]>('selectedDocs', { default: () => [] })
const pendingCustomFields = defineModel<CourseCustomFieldDraft[]>('pendingCustomFields', { default: () => [] })
</script>
