<template>
  <div class="space-y-8">
    <div v-if="loading" class="grid sm:grid-cols-3 gap-4">
      <div v-for="n in 3" :key="n" class="skeleton h-28 rounded-2xl" />
    </div>

    <template v-else>
      <section class="grid sm:grid-cols-3 gap-4">
        <div class="card-flat p-5">
          <p class="text-sm text-muted">Inscrições</p>
          <p class="text-3xl font-semibold text-primary mt-1">{{ enrollments.length }}</p>
          <p class="text-xs text-muted mt-1">cursos na sua conta</p>
        </div>
        <div class="card-flat p-5">
          <p class="text-sm text-muted">Em andamento</p>
          <p class="text-3xl font-semibold text-accent mt-1">{{ inProgressCount }}</p>
          <p class="text-xs text-muted mt-1">ativos ou em análise</p>
        </div>
        <div class="card-flat p-5">
          <p class="text-sm text-muted">Concluídos</p>
          <p class="text-3xl font-semibold text-primary mt-1">{{ completedCount }}</p>
          <p class="text-xs text-muted mt-1">com certificado ou finalizados</p>
        </div>
      </section>

      <section class="grid md:grid-cols-3 gap-4">
        <NuxtLink to="/conta/perfil" class="card-flat p-5 hover:border-primary/30 transition-colors no-underline group">
          <p class="font-semibold text-primary group-hover:text-accent">Editar perfil</p>
          <p class="text-sm text-muted mt-1">Nome, telefone, endereço e dados cadastrais.</p>
        </NuxtLink>
        <NuxtLink to="/conta/seguranca" class="card-flat p-5 hover:border-primary/30 transition-colors no-underline group">
          <p class="font-semibold text-primary group-hover:text-accent">Senha e e-mail</p>
          <p class="text-sm text-muted mt-1">Troque a senha ou o e-mail de acesso.</p>
        </NuxtLink>
        <NuxtLink to="/conta/cursos" class="card-flat p-5 hover:border-primary/30 transition-colors no-underline group">
          <p class="font-semibold text-primary group-hover:text-accent">Meus cursos</p>
          <p class="text-sm text-muted mt-1">Veja o progresso e acesse cada turma.</p>
        </NuxtLink>
      </section>

      <section>
        <div class="flex items-center justify-between gap-3 mb-4">
          <h2 class="text-lg font-semibold text-primary">Cursos recentes</h2>
          <NuxtLink v-if="enrollments.length" to="/conta/cursos" class="text-sm text-accent font-semibold">
            Ver todos →
          </NuxtLink>
        </div>

        <div v-if="!enrollments.length" class="card-flat p-8 text-center">
          <p class="text-muted">Você ainda não tem inscrições.</p>
          <NuxtLink to="/cursos" class="btn mt-4">Explorar catálogo</NuxtLink>
        </div>

        <div v-else class="space-y-3">
          <AccountCourseCard
            v-for="item in recentEnrollments"
            :key="item.id"
            :enrollment="item"
          />
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCitizenDashboard } from '~/composables/useCitizenDashboard'
import AccountCourseCard from '~/components/account/AccountCourseCard.vue'

usePageSeo({
  title: 'Minha conta',
  description: 'Gerencie seu perfil, senha, e-mail e cursos no Treinar para Empregar.',
  path: '/conta',
  noindex: true,
})

const { enrollments, loading, refresh } = useCitizenDashboard()

const inProgressCount = computed(() =>
  enrollments.value.filter(e => ['pendente', 'em_analise', 'repassado_parceiro', 'confirmado_parceiro', 'em_andamento'].includes(e.status)).length,
)

const completedCount = computed(() => enrollments.value.filter(e => e.status === 'concluido').length)

const recentEnrollments = computed(() => enrollments.value.slice(0, 3))

onMounted(() => refresh())
</script>
