<script setup lang="ts">
const route = useRoute()

if (route.path.startsWith('/api') || route.path.startsWith('/_')) {
  throw createError({ statusCode: 404, statusMessage: 'Página não encontrada' })
}

throw createError({
  statusCode: 404,
  statusMessage: 'Página não encontrada',
  message: 'A página que você tentou acessar não existe ou foi movida.',
})
</script>
