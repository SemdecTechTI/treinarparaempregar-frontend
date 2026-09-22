export type CourseCustomFieldDraft = {
  id?: number
  label: string
  type: string
  sort_order: number
  required: boolean
  options?: string[] | null
  optionsText?: string
  apply_to_all?: boolean
  condition_field_id?: number | null
  condition_operator?: string | null
  condition_value?: string | null
  _localKey?: string
}

export type LibraryFieldAttachment = {
  id: number
  label: string
  type?: string
  sort_order: number
  selected: boolean
  locked?: boolean
  conditionHint?: string
}
