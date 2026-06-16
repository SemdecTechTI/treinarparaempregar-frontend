<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
await navigateTo(`/formulario/${slug}`, { redirectCode: 301 })
</script>
