import Swal, { type SweetAlertIcon, type SweetAlertOptions } from 'sweetalert2'

const PRIMARY = '#284f94'
const DANGER = '#c85c5d'
const MUTED = '#a1a2a4'

function baseOptions(): SweetAlertOptions {
  return {
    confirmButtonColor: PRIMARY,
    cancelButtonColor: MUTED,
    buttonsStyling: true,
  }
}

export function useDialog() {
  async function alert(message: string, title = 'Aviso', icon: SweetAlertIcon = 'info') {
    await Swal.fire({
      ...baseOptions(),
      title,
      text: message,
      icon,
      confirmButtonText: 'OK',
    })
  }

  async function success(message: string, title = 'Sucesso') {
    await Swal.fire({
      ...baseOptions(),
      title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
    })
  }

  async function error(message: string, title = 'Erro') {
    await Swal.fire({
      ...baseOptions(),
      title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
    })
  }

  async function info(message: string, title = 'Aviso') {
    await alert(message, title, 'info')
  }

  async function toastSuccess(message: string) {
    await Swal.fire({
      ...baseOptions(),
      icon: 'success',
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2200,
      timerProgressBar: true,
    })
  }

  async function confirm(
    message: string,
    options?: {
      title?: string
      confirmText?: string
      cancelText?: string
      danger?: boolean
    },
  ): Promise<boolean> {
    const result = await Swal.fire({
      ...baseOptions(),
      title: options?.title ?? 'Confirmação',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: options?.confirmText ?? 'Confirmar',
      cancelButtonText: options?.cancelText ?? 'Cancelar',
      confirmButtonColor: options?.danger ? DANGER : PRIMARY,
    })
    return result.isConfirmed
  }

  /** Prompt de texto; retorna null se cancelado. Valor vazio é permitido. */
  async function prompt(
    message: string,
    defaultValue = '',
    options?: { title?: string },
  ): Promise<string | null> {
    const result = await Swal.fire({
      ...baseOptions(),
      title: options?.title ?? message,
      text: options?.title ? message : undefined,
      input: 'text',
      inputValue: defaultValue,
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancelar',
    })
    if (!result.isConfirmed) return null
    return String(result.value ?? '')
  }

  /** Exibe URL somente leitura quando o clipboard falha. */
  async function copyFallback(url: string) {
    await Swal.fire({
      ...baseOptions(),
      title: 'Copie o link',
      input: 'text',
      inputValue: url,
      inputAttributes: { readonly: 'true' },
      confirmButtonText: 'Fechar',
    })
  }

  return {
    alert,
    success,
    error,
    info,
    toastSuccess,
    confirm,
    prompt,
    copyFallback,
  }
}
