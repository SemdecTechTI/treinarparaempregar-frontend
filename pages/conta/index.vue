<template>
  <div class="container mx-auto px-4 py-12 max-w-4xl">
    <h1 class="mb-8">Minha Conta</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-primary mb-4">Meu perfil</h2>
        <dl class="space-y-2 text-sm">
          <div><dt class="text-muted">Nome</dt><dd>{{ data?.user?.name }}</dd></div>
          <div><dt class="text-muted">Email</dt><dd>{{ data?.user?.email }}</dd></div>
          <div><dt class="text-muted">Telefone</dt><dd>{{ data?.user?.phone || '—' }}</dd></div>
          <div><dt class="text-muted">CPF</dt><dd>{{ data?.user?.cpf || '—' }}</dd></div>
        </dl>
      </div>

      <div class="lg:col-span-2 space-y-8">
        <section>
          <h2 class="text-lg font-semibold text-primary mb-4">Meus cursos</h2>
          <div v-if="!data?.course_enrollments?.length" class="text-muted text-sm">
            Nenhuma inscrição em cursos.
            <NuxtLink to="/cursos" class="text-accent">Explorar catálogo</NuxtLink>
          </div>
          <div class="space-y-3">
            <div
              v-for="e in data?.course_enrollments"
              :key="e.id"
              class="bg-white rounded-lg shadow p-4 flex justify-between items-center gap-4"
            >
              <div>
                <p class="font-medium">{{ e.course?.titulo }}</p>
                <p class="text-xs text-muted">
                  {{ trilhaLabel(e.course?.trilha) }} · {{ modalidadeLabel(e.course?.modalidade) }}
                </p>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <EnrollmentStatusBadge :status="e.status" />
                <NuxtLink
                  v-if="e.course?.slug"
                  :to="`/cursos/${e.course.slug}`"
                  class="text-sm text-accent whitespace-nowrap"
                >
                  Ver curso →
                </NuxtLink>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-primary mb-4">Meus acervos</h2>
          <div v-if="!data?.acervo_enrollments?.length" class="text-muted text-sm">
            Nenhum acervo inscrito.
            <NuxtLink to="/acervo" class="text-accent">Explorar acervos</NuxtLink>
          </div>
          <div class="space-y-3">
            <div v-for="e in data?.acervo_enrollments" :key="e.id" class="bg-white rounded-lg shadow p-4">
              <div class="flex justify-between items-start mb-2">
                <p class="font-medium">{{ e.acervo?.titulo }}</p>
                <EnrollmentStatusBadge :status="e.status" />
              </div>
              <ProgressBar :percent="e.progress_percent || 0" class="mb-3" />
              <NuxtLink :to="`/acervo/${e.acervo?.slug}`" class="text-sm text-accent">Assistir vídeos →</NuxtLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

usePageSeo({
  title: 'Minha conta',
  description: 'Gerencie suas inscrições e acesse seus cursos no Treinar para Empregar.',
  path: '/conta',
  noindex: true,
})

const data = ref<any>(null)

const trilhaLabels: Record<string, string> = {
  base: 'Base',
  saude: 'Saúde',
  servicos: 'Serviços',
  tecnicos: 'Técnicos',
}

function trilhaLabel(trilha?: string) {
  if (!trilha) return '—'
  return trilhaLabels[trilha] || trilha
}

function modalidadeLabel(modalidade?: string) {
  if (modalidade === 'ead') return 'EAD'
  if (modalidade === 'presencial') return 'Presencial'
  return modalidade || '—'
}

onMounted(async () => {
  data.value = await useApi('/dashboard')
})
</script>
