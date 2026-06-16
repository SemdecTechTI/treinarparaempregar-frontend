<template>
  <div
    class="tpe-form-page"
    :class="{ 'tpe-form-page--has-photo': backgroundUrl }"
    :style="backgroundUrl ? { '--tpe-form-bg-image': `url('${backgroundUrl}')` } : undefined"
  >
    <div v-if="preview.before_start" class="tpe-notification is-info">
      Este formulário ainda não está aberto para respostas.
    </div>
    <div v-if="preview.after_end" class="tpe-notification is-warning">
      O período de respostas deste formulário já encerrou.
    </div>
    <div v-if="preview.limit_reached" class="tpe-notification is-warning">
      Este formulário já atingiu o limite máximo de respostas.
    </div>

    <div v-if="success" class="tpe-form-shell">
      <div class="tpe-form-wrapper tpe-success-box">
        <h1 class="title">{{ alreadySubmitted ? 'Resposta já registrada' : 'Respostas enviadas!' }}</h1>
        <p class="tpe-success-lead">
          {{ alreadySubmitted
            ? 'Você já enviou uma resposta para este formulário com este identificador.'
            : 'Obrigado por participar. Suas informações foram recebidas com sucesso.' }}
        </p>
      </div>
    </div>

    <div v-else-if="!preview.limit_reached" class="tpe-form-shell">
      <div class="tpe-form-wrapper">
        <header class="tpe-form-hero">
          <h1>{{ form.title }}</h1>
          <div v-if="form.description" class="tpe-form-desc">{{ form.description }}</div>
        </header>

        <form ref="formEl" class="tpe-main-form" @submit.prevent="submit">
          <div v-if="form.unique_submission && form.unique_key_type === 'email'" class="box">
            <h2 class="subtitle">Identificação <span class="tpe-required">*</span></h2>
            <p class="tpe-help-block">Apenas uma resposta é permitida por e-mail.</p>
            <label class="label" for="tpe-respondent-unique">E-mail</label>
            <input id="tpe-respondent-unique" v-model="respondentUnique" class="input" type="email" required placeholder="seu@email.com" />
          </div>

          <div v-if="form.unique_submission && form.unique_key_type === 'cpf'" class="box">
            <h2 class="subtitle">Identificação <span class="tpe-required">*</span></h2>
            <p class="tpe-help-block">Apenas uma resposta é permitida por CPF.</p>
            <label class="label" for="tpe-respondent-cpf">CPF</label>
            <input id="tpe-respondent-cpf" v-model="respondentUnique" class="input" type="text" required placeholder="000.000.000-00" maxlength="14" />
          </div>

          <div v-if="!form.is_anonymous" class="box">
            <h2 class="subtitle">Dados do respondente</h2>
            <label class="label">Nome completo <span class="tpe-required">*</span></label>
            <input v-model="respondentName" class="input" type="text" required />
            <template v-if="form.unique_submission && form.unique_key_type === 'email'">
              <p class="tpe-help-block">O e-mail de confirmação é o informado no primeiro campo.</p>
            </template>
            <template v-else>
              <label class="label">
                E-mail
                <span v-if="!form.unique_submission || form.unique_key_type !== 'cpf'" class="tpe-required">*</span>
              </label>
              <input v-model="respondentEmail" class="input" type="email" :required="!form.unique_submission || form.unique_key_type !== 'cpf'" />
            </template>
          </div>

          <template v-for="field in fields" :key="field.id">
            <div
              v-if="field.type === 'static_text'"
              class="tpe-static-text tpe-field-shell"
              :data-tpe-conditional="condAttr(field)"
              :data-tpe-trigger-type="field.conditional_trigger_type || undefined"
              :style="field.conditional_inline_style || undefined"
            >
              <h2 class="tpe-static-title">{{ field.label }}</h2>
              <div v-if="field.description" class="tpe-static-content">{{ field.description }}</div>
            </div>

            <div
              v-else
              class="box tpe-field-card"
              :class="{ 'tpe-field-shell': field.conditional }"
              :data-tpe-conditional="condAttr(field)"
              :data-tpe-trigger-type="field.conditional_trigger_type || undefined"
              :style="field.conditional_inline_style || undefined"
            >
              <label class="label" :for="`tpe-f-${field.id}`">
                {{ field.label }}
                <span v-if="field.required" class="tpe-required">*</span>
              </label>
              <p v-if="field.description" class="tpe-help-block">{{ field.description }}</p>

              <input
                v-if="field.type === 'text'"
                :id="`tpe-f-${field.id}`"
                v-model="fieldValues[field.id]"
                class="input"
                type="text"
                :required="field.required && !field.conditional"
                :data-tpe-if-required="field.required && field.conditional ? '1' : undefined"
              />

              <textarea
                v-else-if="field.type === 'textarea'"
                :id="`tpe-f-${field.id}`"
                v-model="fieldValues[field.id]"
                class="textarea input"
                :required="field.required && !field.conditional"
                :data-tpe-if-required="field.required && field.conditional ? '1' : undefined"
              />

              <input
                v-else-if="field.type === 'number'"
                :id="`tpe-f-${field.id}`"
                v-model="fieldValues[field.id]"
                class="input"
                type="number"
                :required="field.required && !field.conditional"
                :data-tpe-if-required="field.required && field.conditional ? '1' : undefined"
              />

              <input
                v-else-if="field.type === 'email'"
                :id="`tpe-f-${field.id}`"
                v-model="fieldValues[field.id]"
                class="input"
                type="email"
                :required="field.required && !field.conditional"
                :data-tpe-if-required="field.required && field.conditional ? '1' : undefined"
              />

              <input
                v-else-if="field.type === 'phone'"
                :id="`tpe-f-${field.id}`"
                v-model="fieldValues[field.id]"
                class="input"
                type="tel"
                pattern="[0-9()\s\-+]{8,20}"
                placeholder="(99) 99999-9999"
                :required="field.required && !field.conditional"
                :data-tpe-if-required="field.required && field.conditional ? '1' : undefined"
              />

              <input
                v-else-if="field.type === 'date'"
                :id="`tpe-f-${field.id}`"
                v-model="fieldValues[field.id]"
                class="input"
                type="date"
                :required="field.required && !field.conditional"
                :data-tpe-if-required="field.required && field.conditional ? '1' : undefined"
              />

              <select
                v-else-if="field.type === 'select'"
                :id="`tpe-f-${field.id}`"
                v-model="fieldValues[field.id]"
                class="input"
                :required="field.required && !field.conditional"
                :data-tpe-if-required="field.required && field.conditional ? '1' : undefined"
              >
                <option v-for="opt in field.options || []" :key="opt" :value="opt">{{ opt }}</option>
              </select>

              <template v-else-if="field.type === 'radio' || field.type === 'scale'">
                <label v-for="(opt, i) in field.options || []" :key="opt" class="radio">
                  <input
                    :id="`tpe-f-${field.id}-${i}`"
                    v-model="fieldValues[field.id]"
                    type="radio"
                    :name="`field_${field.id}`"
                    :value="opt"
                    :required="field.required && !field.conditional && i === 0"
                    :data-tpe-if-required="field.required && field.conditional && i === 0 ? '1' : undefined"
                  />
                  {{ opt }}
                </label>
              </template>

              <template v-else-if="field.type === 'checkbox'">
                <label v-for="(opt, i) in field.options || []" :key="opt" class="checkbox">
                  <input
                    :id="`tpe-f-${field.id}-${i}`"
                    v-model="checkboxValues[field.id]"
                    type="checkbox"
                    :value="opt"
                  />
                  {{ opt }}
                </label>
              </template>

              <input
                v-else-if="field.type === 'file'"
                :id="`tpe-f-${field.id}`"
                type="file"
                :required="field.required && !field.conditional"
                :data-tpe-if-required="field.required && field.conditional ? '1' : undefined"
                @change="onFileChange(field.id, $event)"
              />
            </div>
          </template>

          <p v-if="submitError" class="text-red-600 text-sm mb-3">{{ submitError }}</p>

          <div class="tpe-submit-row">
            <button type="submit" class="button is-primary" :disabled="submitting">
              {{ submitting ? 'Enviando...' : 'Enviar respostas' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  form: any
  fields: any[]
  preview: { before_start: boolean; after_end: boolean; limit_reached: boolean }
  hasConditionalFields?: boolean
}>()

const backgroundUrl = computed(() => props.form.background_url || props.form.background_image || null)

const success = ref(false)
const alreadySubmitted = ref(false)
const submitting = ref(false)
const submitError = ref('')
const formEl = ref<HTMLFormElement | null>(null)

const respondentUnique = ref('')
const respondentName = ref('')
const respondentEmail = ref('')
const fieldValues = reactive<Record<number, string>>({})
const checkboxValues = reactive<Record<number, string[]>>({})
const fileInputs = reactive<Record<number, File | null>>({})

props.fields.forEach((f) => {
  if (f.type === 'checkbox') checkboxValues[f.id] = []
})

function condAttr(field: any) {
  if (!field.conditional) return undefined
  return JSON.stringify(field.conditional)
}

function onFileChange(fieldId: number, e: Event) {
  const input = e.target as HTMLInputElement
  fileInputs[fieldId] = input.files?.[0] ?? null
}

onMounted(() => {
  if (props.hasConditionalFields) {
    const s = document.createElement('script')
    s.src = '/js/tpe-form-conditions.js'
    s.defer = true
    document.body.appendChild(s)
  }
})

async function submit() {
  submitting.value = true
  submitError.value = ''
  try {
    await ensureSanctumCsrf()
    const fd = new FormData()
    if (props.form.unique_submission) {
      fd.append('__respondent_unique', respondentUnique.value)
    }
    if (!props.form.is_anonymous) {
      fd.append('__name', respondentName.value)
      if (!props.form.unique_submission || props.form.unique_key_type !== 'email') {
        fd.append('__email', respondentEmail.value)
      }
    }
    props.fields.forEach((f) => {
      if (f.type === 'static_text') return
      if (f.type === 'checkbox') {
        const vals = checkboxValues[f.id] || []
        vals.forEach((v) => fd.append(`field_${f.id}[]`, v))
      } else if (f.type === 'file') {
        const file = fileInputs[f.id]
        if (file) fd.append(`field_${f.id}`, file)
      } else {
        fd.append(`field_${f.id}`, fieldValues[f.id] ?? '')
      }
    })

    const res = await useApiForm<any>(`/forms/${props.form.slug}/submit`, fd)
    alreadySubmitted.value = !!res.already
    success.value = true
  } catch (e: any) {
    submitError.value = e?.data?.message || 'Não foi possível enviar. Verifique os campos e tente novamente.'
  } finally {
    submitting.value = false
  }
}
</script>
