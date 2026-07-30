<template>
  <div>
    <AdminHeader :title="pageTitle">
      <AdminActionButton to="/admin/cursos" label="Voltar aos cursos" variant="outline" size="md" />
    </AdminHeader>

    <p v-if="courseError" class="text-red-600 text-sm mb-4">{{ courseError }}</p>

    <AdminEnrollmentsTable
      v-if="!courseError"
      :course-id="courseId"
      empty-message="Nenhum inscrito neste curso."
      empty-hint="As inscrições aparecerão aqui quando cidadãos se cadastrarem."
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'courses' })

const route = useRoute()
const courseId = Number(route.params.id)

const courseTitle = ref('')
const courseError = ref('')

const pageTitle = computed(() =>
  courseTitle.value ? `Inscritos: ${courseTitle.value}` : 'Inscritos',
)

onMounted(async () => {
  try {
    const course = await useApi<any>(`/admin/courses/${courseId}`)
    courseTitle.value = course.title
  } catch (e: any) {
    courseError.value = e?.data?.message || 'Curso não encontrado.'
  }
})
</script>
