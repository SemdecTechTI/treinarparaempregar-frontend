<template>
  <div class="rich-editor rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
    <div v-if="editor" class="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-slate-50/90">
      <button
        type="button"
        class="rich-editor__btn"
        :class="{ 'rich-editor__btn--active': editor.isActive('bold') }"
        title="Negrito"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <span class="font-bold text-sm">B</span>
      </button>
      <button
        type="button"
        class="rich-editor__btn"
        :class="{ 'rich-editor__btn--active': editor.isActive('italic') }"
        title="Itálico"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <span class="italic text-sm">I</span>
      </button>
      <button
        type="button"
        class="rich-editor__btn"
        :class="{ 'rich-editor__btn--active': editor.isActive('underline') }"
        title="Sublinhado"
        @click="editor.chain().focus().toggleUnderline().run()"
      >
        <span class="underline text-sm">U</span>
      </button>
      <button
        type="button"
        class="rich-editor__btn"
        :class="{ 'rich-editor__btn--active': editor.isActive('strike') }"
        title="Tachado"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <span class="line-through text-sm">S</span>
      </button>

      <span class="w-px h-6 bg-gray-200 mx-1" />

      <button
        type="button"
        class="rich-editor__btn"
        :class="{ 'rich-editor__btn--active': editor.isActive('heading', { level: 2 }) }"
        title="Título H2"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </button>
      <button
        type="button"
        class="rich-editor__btn"
        :class="{ 'rich-editor__btn--active': editor.isActive('heading', { level: 3 }) }"
        title="Título H3"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        H3
      </button>

      <span class="w-px h-6 bg-gray-200 mx-1" />

      <button
        type="button"
        class="rich-editor__btn"
        :class="{ 'rich-editor__btn--active': editor.isActive('bulletList') }"
        title="Lista com marcadores"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <button
        type="button"
        class="rich-editor__btn"
        :class="{ 'rich-editor__btn--active': editor.isActive('orderedList') }"
        title="Lista numerada"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 6h13M7 12h13M7 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      </button>
      <button
        type="button"
        class="rich-editor__btn"
        :class="{ 'rich-editor__btn--active': editor.isActive('blockquote') }"
        title="Citação"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h6m-6 4h10" />
        </svg>
      </button>

      <span class="w-px h-6 bg-gray-200 mx-1" />

      <button
        type="button"
        class="rich-editor__btn"
        :class="{ 'rich-editor__btn--active': editor.isActive('link') }"
        title="Link"
        @click="toggleLink"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </button>
      <button
        type="button"
        class="rich-editor__btn"
        title="Linha horizontal"
        @click="editor.chain().focus().setHorizontalRule().run()"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-width="2" d="M5 12h14" />
        </svg>
      </button>

      <span class="w-px h-6 bg-gray-200 mx-1" />

      <button
        type="button"
        class="rich-editor__btn"
        title="Desfazer"
        :disabled="!editor.can().undo()"
        @click="editor.chain().focus().undo().run()"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a5 5 0 015 5v2M3 10l4-4m-4 4l4 4" />
        </svg>
      </button>
      <button
        type="button"
        class="rich-editor__btn"
        title="Refazer"
        :disabled="!editor.can().redo()"
        @click="editor.chain().focus().redo().run()"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a5 5 0 00-5 5v2m15-7l-4-4m4 4l-4 4" />
        </svg>
      </button>
    </div>

    <EditorContent :editor="editor" class="rich-editor__content" />
  </div>
</template>

<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'

const model = defineModel<string>({ default: '' })

const dialog = useDialog()

const editor = useEditor({
  content: model.value || '',
  extensions: [
    StarterKit.configure({
      heading: { levels: [2, 3] },
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
    }),
    Placeholder.configure({
      placeholder: 'Escreva o conteúdo do artigo…',
    }),
  ],
  editorProps: {
    attributes: {
      class: 'rich-editor__prose',
    },
  },
  onUpdate: ({ editor: ed }) => {
    model.value = ed.getHTML()
  },
})

watch(
  () => model.value,
  (value) => {
    if (!editor.value) return
    const html = value || ''
    if (editor.value.getHTML() !== html) {
      editor.value.commands.setContent(html, false)
    }
  },
)

function toggleLink() {
  if (!editor.value) return
  const previousUrl = editor.value.getAttributes('link').href as string | undefined
  dialog.prompt('URL do link', previousUrl || 'https://', { title: 'Inserir link' }).then((url) => {
    if (url === null) return
    if (url === '') {
      editor.value!.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.value!.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  })
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.rich-editor__btn {
  @apply inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-lg text-xs font-semibold text-slate-600 transition-colors;
  @apply hover:bg-white hover:text-primary border border-transparent hover:border-gray-200;
}

.rich-editor__btn--active {
  @apply bg-primary text-white border-primary hover:bg-primary hover:text-white;
}

.rich-editor__btn:disabled {
  @apply opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-600 hover:border-transparent;
}

.rich-editor__content :deep(.rich-editor__prose) {
  @apply min-h-[280px] px-4 py-3 text-sm text-text outline-none;
}

.rich-editor__content :deep(.rich-editor__prose p.is-editor-empty:first-child::before) {
  @apply text-muted float-left h-0 pointer-events-none;
  content: attr(data-placeholder);
}

.rich-editor__content :deep(.rich-editor__prose p) {
  margin-bottom: 0.75rem;
  line-height: 1.7;
}

.rich-editor__content :deep(.rich-editor__prose h2) {
  @apply text-xl font-semibold text-primary mt-4 mb-2;
}

.rich-editor__content :deep(.rich-editor__prose h3) {
  @apply text-lg font-semibold text-primary mt-3 mb-2;
}

.rich-editor__content :deep(.rich-editor__prose ul),
.rich-editor__content :deep(.rich-editor__prose ol) {
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
}

.rich-editor__content :deep(.rich-editor__prose li) {
  margin-bottom: 0.35rem;
}

.rich-editor__content :deep(.rich-editor__prose blockquote) {
  @apply border-l-4 border-accent pl-4 my-4 text-muted italic;
}

.rich-editor__content :deep(.rich-editor__prose a) {
  @apply text-accent font-semibold underline;
}

.rich-editor__content :deep(.rich-editor__prose hr) {
  @apply my-6 border-gray-200;
}
</style>
