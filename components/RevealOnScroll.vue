<template>
  <div ref="elRef" class="reveal" :class="className">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ delay?: number; class?: string }>()
const elRef = ref<HTMLElement | null>(null)
const { observe } = useReveal()
const className = computed(() => props.class)

onMounted(() => {
  observe(elRef.value, props.delay ?? 0)
})
</script>
