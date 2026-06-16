<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

await navigateTo(`/cursos/${slug}`, { redirectCode: 301 })
</script>
