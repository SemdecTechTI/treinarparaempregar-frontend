export type CourseCustomFieldDraft = {
  id?: number
  label: string
  type: string
  ordem: number
  required: boolean
  options?: string[] | null
  optionsText?: string
  _localKey?: string
}
