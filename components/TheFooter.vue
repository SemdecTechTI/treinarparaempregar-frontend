<template>
  <footer class="relative mt-16 overflow-hidden pb-0">
    <div class="absolute inset-0 bg-gradient-to-b from-[#1a2d4a] to-[#0f1f38]" />
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
    <div class="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />

    <div class="container mx-auto px-4 py-14 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <AppLogo variant="white" link-class="inline-block mb-4" />
          <p class="text-sm text-gray-300 leading-relaxed">
            Programa municipal de qualificação profissional da Secretaria de Desenvolvimento Econômico, Emprego e Renda de Salvador.
          </p>
          <div class="flex gap-2 mt-5">
            <a :href="SOCIAL_FACEBOOK_URL" target="_blank" rel="noopener" class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gray-300 hover:bg-white/20 hover:text-white transition-all hover:scale-105" aria-label="Facebook">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a :href="SOCIAL_INSTAGRAM_URL" target="_blank" rel="noopener" class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-gray-300 hover:bg-white/20 hover:text-white transition-all hover:scale-105" aria-label="Instagram">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 class="font-semibold mb-4 text-h4">Menu rápido</h4>
          <ul class="space-y-2.5 text-sm text-gray-300">
            <li><NuxtLink to="/quem-somos" class="hover:text-white transition-colors inline-flex items-center gap-1 group"><span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span> Quem somos</NuxtLink></li>
            <li><NuxtLink to="/cursos" class="hover:text-white transition-colors inline-flex items-center gap-1 group"><span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span> Cursos</NuxtLink></li>
            <li><NuxtLink to="/blog" class="hover:text-white transition-colors inline-flex items-center gap-1 group"><span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span> Blog</NuxtLink></li>
            <li><NuxtLink to="/cadastrar" class="hover:text-white transition-colors inline-flex items-center gap-1 group"><span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span> Cadastrar</NuxtLink></li>
            <li><NuxtLink to="/seja-parceiro" class="hover:text-white transition-colors inline-flex items-center gap-1 group"><span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span> Seja um parceiro</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold mb-4 text-h4">Trilhas</h4>
          <ul class="space-y-2.5 text-sm text-gray-300">
            <li><NuxtLink to="/trilhas/base" class="hover:text-white transition-colors">Base</NuxtLink></li>
            <li><NuxtLink to="/trilhas/saude" class="hover:text-white transition-colors">Carreiras (Saúde)</NuxtLink></li>
            <li><NuxtLink to="/trilhas/servicos" class="hover:text-white transition-colors">Soft Skills (Serviços)</NuxtLink></li>
            <li><NuxtLink to="/trilhas/tecnicos" class="hover:text-white transition-colors">Técnicos (Construção Civil)</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold mb-4 text-h4">Newsletter</h4>
          <p class="text-sm text-gray-300 mb-4">Receba novidades sobre cursos e oportunidades.</p>
          <form @submit.prevent="subscribe" class="flex gap-2">
            <input v-model="email" type="email" placeholder="Seu email" class="flex-1 px-4 py-2.5 rounded-xl text-text text-sm bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50" required />
            <button type="submit" class="btn btn-accent py-2.5 px-4 text-sm rounded-xl shrink-0">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const email = ref('')
const dialog = useDialog()

async function subscribe() {
  await dialog.info('Newsletter cadastrada! (funcionalidade em desenvolvimento)', 'Newsletter')
  email.value = ''
}
</script>
