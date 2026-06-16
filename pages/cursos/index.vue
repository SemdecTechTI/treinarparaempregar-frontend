<template>
  <div>
    <section class="container mx-auto px-4 pt-10 lg:pt-14 pb-20">
      <CourseCatalog
        :per-page="12"
        show-pagination
        sync-query
        embedded
      />
    </section>
  </div>
</template>

<script setup lang="ts">
usePageSeo({
  title: 'Cursos disponíveis',
  description: 'Catálogo de cursos presenciais e online gratuitos do Treinar para Empregar. Filtre por trilha e modalidade.',
  path: '/cursos',
})
</script>
