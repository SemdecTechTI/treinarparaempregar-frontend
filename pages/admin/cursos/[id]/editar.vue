<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const id = Number(route.params.id)

await navigateTo(`/admin/cursos/${id}`, { redirectCode: 301 })
</script>
