export function normalizeCnpj(value: string): string {
  return value.replace(/\D/g, '')
}

export function isValidCnpj(value: string): boolean {
  const digits = normalizeCnpj(value)
  if (digits.length !== 14) return false
  if (/^(\d)\1{13}$/.test(digits)) return false

  const calc = (base: string, factors: number[]) => {
    const sum = factors.reduce((acc, factor, i) => acc + Number(base[i]) * factor, 0)
    const rest = sum % 11
    return rest < 2 ? 0 : 11 - rest
  }

  const d1 = calc(digits, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  if (d1 !== Number(digits[12])) return false
  const d2 = calc(digits, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  return d2 === Number(digits[13])
}

export function formatCnpj(value: string): string {
  const d = normalizeCnpj(value)
  if (d.length !== 14) return value
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}
