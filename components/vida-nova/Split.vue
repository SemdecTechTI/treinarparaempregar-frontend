<template>
  <component :is="tag" ref="elRef" class="vn-split">
    <span v-for="(w, i) in words" :key="i" class="vn-split-w" :class="w.accent ? accentClass : undefined">
      <span :style="{ transitionDelay: `${i * 45}ms` }">{{ w.text }}</span>
    </span>
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ text: string; accent?: string; accentClass?: string; tag?: string }>(), {
  tag: 'h2',
})

const elRef = ref<HTMLElement | null>(null)
const { observe } = useReveal()

const words = computed(() => {
  const start = props.accent ? props.text.indexOf(props.accent) : -1
  const end = start + (props.accent?.length ?? 0)
  let pos = 0
  return props.text.split(' ').map((text) => {
    const accent = start >= 0 && pos >= start && pos < end
    pos += text.length + 1
    return { text, accent }
  })
})

onMounted(() => observe(elRef.value))
</script>

<style>
.vn-split-w {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  padding: 0.12em 0;
  margin: -0.12em 0.26em -0.12em 0;
}

.vn-split-w > span {
  display: inline-block;
  transform: translateY(115%);
  transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}

.vn-split.visible .vn-split-w > span {
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .vn-split-w > span {
    transform: none;
    transition: none;
  }
}
</style>
