export type JobVacancyStatus = 'pending' | 'approved' | 'rejected'

export interface Company {
  id: number
  cnpj: string
  legal_name: string
  trade_name: string
  company_size: string
  business_activity: string
  address: string
  zip_code: string
  city: string
  neighborhood?: string | null
  reference_point: string
  phone_primary: string
  phone_secondary?: string | null
  contact_name: string
  contact_role: string
  email: string
  website?: string | null
  hiring_periods?: string[] | null
  job_vacancies_count?: number
  job_vacancies?: JobVacancy[]
  created_at?: string
  updated_at?: string
}

export interface JobVacancy {
  id: number
  company_id: number
  job_title: string
  openings_count: number
  vacancy_type: string
  activities: string
  salary: string
  driver_license?: string | null
  vehicle_required?: boolean | null
  education_level: string
  course_requirement: string
  experience_time: string
  work_schedule: string
  work_days: string
  behavioral_profile?: string | null
  benefits?: string[] | null
  other_benefits?: string | null
  proof_types?: string[] | null
  skills?: string | null
  accepts_pwd: boolean
  disability_types?: string[] | null
  pwd_justification?: string | null
  selection_date: string
  selection_time: string
  selection_address: string
  selection_contact: string
  notes?: string | null
  status: JobVacancyStatus
  status_note?: string | null
  duplicated_from_id?: number | null
  company?: Company
  created_at?: string
  updated_at?: string
}

export const HIRING_PERIODS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro', 'Nenhum',
] as const

export const BENEFIT_OPTIONS = [
  'Vale-Transporte',
  'Vale-Refeição',
  'Transporte',
  'Refeitório',
  'Ass. Médica',
  'Ass. Odontológica',
  'Seguro de vida',
  'Comissão',
  'Cesta básica',
  'Adic. Periculosidade',
  'Uniforme',
  'Auxílio Creche',
] as const

export const PROOF_OPTIONS = [
  'Carteira de trabalho',
  'Contrato de trabalho',
  'Declaração',
] as const

export const DISABILITY_OPTIONS = [
  'Visão parcial',
  'Visão total',
  'Membros superiores',
  'Membros inferiores',
  'Cadeirante',
  'Nanismo',
  'Surdez parcial',
  'Surdez total',
] as const

export const COMPANY_SIZES = [
  'MEI',
  'Microempresa',
  'Empresa de Pequeno Porte',
  'Média',
  'Grande',
] as const

export const EDUCATION_LEVELS = [
  'Fundamental Incompleto',
  'Fundamental Completo',
  'Médio Incompleto',
  'Médio Completo',
  'Superior Incompleto',
  'Superior Completo',
  'Pós-graduação',
] as const

export const DRIVER_LICENSES = ['Não exige', 'A', 'B', 'AB', 'C', 'D', 'E'] as const
