export type EnrollmentDocumentType = {
  label: string
  max_kb: number
  required_default: boolean
}

export const DEFAULT_DOCUMENT_TYPES: Record<string, EnrollmentDocumentType> = {
  documento_identificacao: {
    label: 'Documento de identificação com foto (RG, CNH)',
    max_kb: 10240,
    required_default: true,
  },
  foto_rg_frente: { label: 'Foto RG frente', max_kb: 10240, required_default: true },
  foto_rg_fundo: { label: 'Foto RG verso', max_kb: 10240, required_default: true },
  foto_cpf: { label: 'Foto CPF', max_kb: 10240, required_default: true },
  comprovante_residencia: {
    label: 'Comprovante de residência',
    max_kb: 10240,
    required_default: true,
  },
  foto_comprovante_residencia: {
    label: 'Foto comprovante de residência',
    max_kb: 10240,
    required_default: true,
  },
  comprovante_escolaridade: {
    label: 'Comprovante de escolaridade',
    max_kb: 10240,
    required_default: true,
  },
  foto_historico_frente: { label: 'Foto histórico frente', max_kb: 10240, required_default: true },
  foto_historico_fundo: { label: 'Foto histórico verso', max_kb: 10240, required_default: true },
  curriculo: { label: 'Currículo', max_kb: 10240, required_default: true },
  foto_certificado_curso_tecnico: {
    label: 'Foto certificado de curso técnico',
    max_kb: 10240,
    required_default: false,
  },
}

export function resolveDocumentTypes(
  incoming?: Record<string, EnrollmentDocumentType | string> | null,
): Record<string, EnrollmentDocumentType> {
  const source = incoming && Object.keys(incoming).length ? incoming : DEFAULT_DOCUMENT_TYPES
  return Object.fromEntries(
    Object.entries(source).map(([key, entry]) => [key, documentTypeMeta(entry, key)]),
  )
}

export function documentTypeMeta(
  entry: EnrollmentDocumentType | string | undefined,
  fallback = '',
): EnrollmentDocumentType {
  if (!entry) {
    return { label: fallback, max_kb: 10240, required_default: true }
  }
  if (typeof entry === 'string') {
    return { label: entry, max_kb: 10240, required_default: true }
  }
  return {
    label: entry.label || fallback,
    max_kb: entry.max_kb || 10240,
    required_default: entry.required_default !== false,
  }
}

export function formatMaxUpload(maxKb: number) {
  return maxKb >= 1024 ? `${Math.round(maxKb / 1024)} MB` : `${maxKb} KB`
}
