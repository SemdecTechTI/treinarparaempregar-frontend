export type CourseCustomFieldDraft = {
  id?: number
  label: string
  type: string
  sort_order: number
  required: boolean
  options?: string[] | null
  optionsText?: string
  _localKey?: string
}
