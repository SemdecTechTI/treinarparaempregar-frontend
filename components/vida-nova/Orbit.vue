<template>
  <div
    ref="rootEl"
    class="grid lg:grid-cols-[1.05fr_1fr] gap-8 sm:gap-12 lg:gap-20 items-center"
    @pointerenter="hovering = true"
    @pointerleave="hovering = false"
  >
    <div class="relative mx-auto w-full max-w-[20rem] sm:max-w-[32rem] aspect-square">
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" aria-hidden="true">
        <circle class="orbit-ring" cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.35" stroke-dasharray="0.6 1.6" />
        <line
          v-for="(p, i) in points"
          :key="i"
          x1="50"
          y1="50"
          :x2="p.x"
          :y2="p.y"
          class="transition-[stroke] duration-500"
          :stroke="i === active ? '#fddd2a' : 'rgba(255,255,255,0.12)'"
          stroke-width="0.5"
        />
      </svg>
      <div class="orbit-core absolute inset-[30%] rounded-full bg-vn-yellow flex items-center justify-center">
        <img src="/images/vida-nova/logo-vida-nova.webp" alt="" class="w-[66%] h-auto" width="600" height="238">
      </div>
      <button
        v-for="(d, i) in items"
        :key="d.title"
        type="button"
        class="absolute w-[18%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vn-yellow"
        :class="i === active ? 'bg-vn-pink text-white scale-110 shadow-[0_0_0_6px_rgba(235,0,140,0.28)]' : 'bg-white text-vn-pink hover:scale-105'"
        :style="{ left: `${points[i].x}%`, top: `${points[i].y}%` }"
        :aria-pressed="i === active"
        :aria-label="d.title"
        @click="select(i)"
      >
        <svg viewBox="0 0 24 24" class="w-[46%] h-[46%]" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path :d="d.icon" />
        </svg>
        <span
          class="absolute -top-1 -right-1 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-colors duration-500"
          :class="i === active ? 'bg-vn-yellow text-vn-navy' : 'bg-vn-navy text-white'"
        >{{ i + 1 }}</span>
      </button>
    </div>

    <div>
      <div
        class="min-h-[15rem] sm:min-h-[13rem] select-none"
        style="touch-action: pan-y"
        aria-live="polite"
        @pointerdown="startX = $event.clientX"
        @pointerup="onSwipe"
      >
        <Transition :name="dir > 0 ? 'orbit-swap' : 'orbit-back'" mode="out-in">
          <div :key="active">
            <p class="text-vn-yellow font-bold text-xs lg:text-[13px] tracking-[0.2em] uppercase">Dimensão {{ active + 1 }} de {{ items.length }}</p>
            <h3 class="text-3xl lg:text-[2.6rem] leading-tight font-bold text-white mt-3">{{ current.title }}</h3>
            <p class="text-lg text-white/80 font-normal mt-4 leading-relaxed max-w-xl">{{ current.text }}</p>
            <NuxtLink
              v-if="current.highlight"
              to="/cadastre-sua-vaga"
              class="inline-flex items-center gap-2 mt-6 rounded-full bg-vn-yellow text-vn-navy font-bold px-5 py-2.5 hover:!text-vn-navy hover:bg-white transition-colors"
            >
              É aqui que sua empresa entra <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </Transition>
      </div>
      <div class="grid grid-cols-6 sm:grid-cols-3 gap-1.5 sm:gap-2 mt-6 sm:mt-8">
        <button
          v-for="(d, i) in items"
          :key="d.title"
          type="button"
          class="text-left rounded-xl py-3 sm:px-3.5 transition-colors"
          :class="i === active ? 'sm:bg-white/10 text-white' : 'text-white/55 hover:text-white sm:hover:bg-white/5'"
          :aria-label="d.title"
          @click="select(i)"
        >
          <span class="hidden sm:inline text-sm font-semibold">{{ d.title }}</span>
          <span class="block h-1 sm:h-[3px] sm:mt-2.5 rounded-full bg-white/15 sm:bg-white/10 overflow-hidden">
            <span
              v-if="i === active"
              class="orbit-fill block h-full rounded-full bg-vn-yellow"
              :style="{ animationPlayState: running ? 'running' : 'paused' }"
              @animationend="next"
            />
            <span v-else-if="i < active" class="block h-full rounded-full bg-vn-yellow/50 sm:hidden" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface OrbitItem {
  title: string
  text: string
  icon: string
  highlight?: boolean
}

const props = defineProps<{ items: OrbitItem[] }>()

const rootEl = ref<HTMLElement | null>(null)
const active = ref(0)
const hovering = ref(false)
const inView = ref(false)
const reduced = ref(true)

const current = computed(() => props.items[active.value])
const running = computed(() => inView.value && !hovering.value && !reduced.value)

const points = computed(() =>
  props.items.map((_, i) => {
    const a = ((-90 + (360 / props.items.length) * i) * Math.PI) / 180
    return { x: Number((50 + 38 * Math.cos(a)).toFixed(2)), y: Number((50 + 38 * Math.sin(a)).toFixed(2)) }
  }),
)

const dir = ref(1)
const startX = ref(0)

function select(i: number, d = i >= active.value ? 1 : -1) {
  dir.value = d
  active.value = i
}

function step(d: number) {
  const n = props.items.length
  select((active.value + d + n) % n, d)
}

function next() {
  step(1)
}

function onSwipe(e: PointerEvent) {
  const dx = e.clientX - startX.value
  if (Math.abs(dx) >= 40) step(dx < 0 ? 1 : -1)
}

let io: IntersectionObserver | null = null

onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  io = new IntersectionObserver(([entry]) => {
    inView.value = entry.isIntersecting
  }, { threshold: 0.35 })
  if (rootEl.value) io.observe(rootEl.value)
})

onUnmounted(() => io?.disconnect())
</script>

<style scoped>
.orbit-ring {
  transform-origin: 50px 50px;
  animation: orbit-spin 80s linear infinite;
}

.orbit-core {
  box-shadow: 0 0 0 12px rgba(253, 221, 42, 0.14), 0 0 0 28px rgba(253, 221, 42, 0.06);
}

.orbit-core::before {
  content: '';
  position: absolute;
  inset: -16%;
  border-radius: 9999px;
  border: 1px solid rgba(253, 221, 42, 0.45);
  animation: orbit-pulse 3.2s ease-out infinite;
}

.orbit-fill {
  width: 0;
  animation: orbit-fill 5.5s linear forwards;
}

.orbit-swap-enter-active,
.orbit-swap-leave-active,
.orbit-back-enter-active,
.orbit-back-leave-active {
  transition: opacity 0.22s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.orbit-swap-enter-from,
.orbit-back-leave-to {
  opacity: 0;
  transform: translateX(28px);
}

.orbit-swap-leave-to,
.orbit-back-enter-from {
  opacity: 0;
  transform: translateX(-28px);
}

@keyframes orbit-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes orbit-pulse {
  from {
    transform: scale(0.85);
    opacity: 1;
  }
  to {
    transform: scale(1.3);
    opacity: 0;
  }
}

@keyframes orbit-fill {
  to {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbit-ring,
  .orbit-core::before {
    animation: none;
  }

  .orbit-fill {
    animation: none;
    width: 100%;
  }
}
</style>
