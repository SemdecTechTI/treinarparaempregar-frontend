export type RowActionItem = {
  label: string
  to?: string
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
  hidden?: boolean
}
