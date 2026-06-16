<script setup lang="ts">
const route = useRoute()
await navigateTo({
  path: '/cadastrar',
  query: route.query,
})
</script>
