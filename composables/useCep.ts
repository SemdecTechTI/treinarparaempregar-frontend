interface ViaCepResponse {
  cep?: string
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
  erro?: boolean
}

export function useCep() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCep(cep: string) {
    const digits = cep.replace(/\D/g, '')
    error.value = null

    if (digits.length !== 8) {
      error.value = 'Formato de CEP inválido'
      return null
    }

    loading.value = true
    try {
      const data = await $fetch<ViaCepResponse>(`https://viacep.com.br/ws/${digits}/json/`)
      if (data.erro) {
        error.value = 'CEP não encontrado'
        return null
      }
      return {
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        localidade: data.localidade || '',
        uf: data.uf || '',
      }
    } catch {
      error.value = 'Erro ao buscar CEP'
      return null
    } finally {
      loading.value = false
    }
  }

  return { loading, error, fetchCep }
}
