<template>
  <div>
    <AdminHeader title="Inscrições" />
    <AdminEnrollmentsTable />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin', adminModule: 'enrollments' })
</script>
