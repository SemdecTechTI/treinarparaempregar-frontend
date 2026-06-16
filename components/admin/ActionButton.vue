<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="classes"
    :active-class="activeLinkClass"
    :exact-active-class="activeLinkClass"
    v-bind="$attrs"
  >
    {{ label }}
  </NuxtLink>
  <button
    v-else
    :type="submit ? 'submit' : 'button'"
    :class="classes"
    :disabled="disabled"
    v-bind="$attrs"
    @click="onClick"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    label: string
    variant?: 'edit' | 'danger' | 'neutral' | 'primary' | 'outline'
    size?: 'sm' | 'md'
    to?: string
    disabled?: boolean
    submit?: boolean
  }>(),
  { variant: 'edit', size: 'sm', disabled: false, submit: false },
)

const emit = defineEmits<{ click: [] }>()

function onClick() {
  if (!props.submit) emit('click')
}

/** Estado “página atual” — mesmo visual do hover, sem fundo sólido */
const activeLinkClass = computed(() => {
  const map: Record<string, string> = {
    edit: '!bg-[#e8eef7] !border-[#284f94] !text-[#1e3d6f]',
    danger: '!bg-red-50 !border-red-400 !text-red-800',
    neutral: '!bg-[#e8f4f6] !border-[#009aab] !text-[#005a66]',
    primary: '!bg-primary-dark !border-primary-dark !text-white',
    outline: '!bg-[#e8eef7] !border-[#284f94] !text-[#1e3d6f]',
  }
  return map[props.variant]
})

const classes = computed(() => {
  const sizeClasses =
    props.size === 'md'
      ? 'min-w-[6rem] px-5 py-2.5 text-sm font-bold rounded-xl'
      : 'min-w-[5rem] px-3 py-1.5 text-xs font-semibold rounded-lg'

  const base = [
    'inline-flex items-center justify-center border transition-[background-color,border-color,color,box-shadow] duration-150 no-underline',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
    'disabled:opacity-50 disabled:pointer-events-none',
    sizeClasses,
  ].join(' ')

  const variants: Record<string, string> = {
    /* Tabelas: texto escuro + fundo claro no hover (legível) */
    edit: [
      'text-[#284f94] border-slate-200 bg-white shadow-sm',
      'hover:bg-[#e8eef7] hover:border-[#284f94] hover:text-[#1e3d6f] hover:shadow',
      'active:bg-[#dce6f5] active:border-[#284f94] active:text-[#1e3d6f]',
      'focus-visible:ring-primary/30',
    ].join(' '),
    neutral: [
      'text-[#007d8c] border-slate-200 bg-white shadow-sm',
      'hover:bg-[#e8f4f6] hover:border-[#009aab] hover:text-[#005a66] hover:shadow',
      'active:bg-[#d9eef2] active:border-[#009aab] active:text-[#005a66]',
      'focus-visible:ring-accent/30',
    ].join(' '),
    danger: [
      'text-red-700 border-slate-200 bg-white shadow-sm',
      'hover:bg-red-50 hover:border-red-400 hover:text-red-800 hover:shadow',
      'active:bg-red-100 active:border-red-500 active:text-red-900',
      'focus-visible:ring-red-300',
    ].join(' '),
    /* Formulários: botão sólido */
    primary: [
      'text-white border-primary bg-primary shadow-sm',
      'hover:bg-primary-dark hover:border-primary-dark hover:shadow',
      'active:bg-[#1e3d6f] active:border-[#1e3d6f] active:scale-[0.98]',
      'focus-visible:ring-primary/40',
    ].join(' '),
    outline: [
      'text-[#284f94] border-[#284f94] bg-white',
      'hover:bg-[#e8eef7] hover:border-[#284f94] hover:text-[#1e3d6f]',
      'active:bg-[#dce6f5] active:scale-[0.98]',
      'focus-visible:ring-primary/30',
    ].join(' '),
  }

  return `${base} ${variants[props.variant]}`
})
</script>
