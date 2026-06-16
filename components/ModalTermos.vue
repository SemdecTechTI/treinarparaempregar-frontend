<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="open = false">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 lg:p-8 shadow-2xl border border-gray-100">
        <h2 class="text-xl font-semibold text-primary mb-4">Termos de Uso e Política de Privacidade</h2>
        <div class="prose prose-sm text-text space-y-3 text-sm">
          <p>Ao cadastrar-se na plataforma Treinar para Empregar, você concorda com o uso dos seus dados para fins de qualificação profissional, comunicação sobre cursos e repasse de informações aos parceiros responsáveis pelas turmas.</p>
          <p>Os dados coletados incluem informações pessoais, de contato e endereço, utilizados exclusivamente para o programa municipal de qualificação profissional da Prefeitura de Salvador.</p>
          <p>Você pode solicitar a exclusão ou correção dos seus dados entrando em contato com a SEMDEC pelo telefone (71) 3202-7900.</p>
        </div>
        <button class="btn mt-6" @click="open = false">Fechar</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })
</script>
