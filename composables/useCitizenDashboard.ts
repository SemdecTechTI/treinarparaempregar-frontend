export interface CitizenCourse {
  title?: string
  slug?: string
  track?: string
  modality?: string
  image?: string | null
  workload?: string | null
  location?: string | null
  course_start_date?: string | null
  course_end_date?: string | null
  partner?: string | null
}

export interface CitizenEnrollment {
  id: number
  status: string
  created_at?: string
  on_waiting_list?: boolean
  progress_percent?: number | null
  course?: CitizenCourse | null
}

interface DashboardPayload {
  user?: Record<string, unknown>
  course_enrollments?: CitizenEnrollment[]
}

export function useCitizenDashboard() {
  const data = useState<DashboardPayload | null>('citizen-dashboard', () => null)
  const loading = useState('citizen-dashboard-loading', () => false)
  const error = useState<string | null>('citizen-dashboard-error', () => null)

  const enrollments = computed(() => data.value?.course_enrollments ?? [])

  async function refresh() {
    loading.value = true
    error.value = null
    try {
      data.value = await useApi<DashboardPayload>('/dashboard')
    } catch (e: any) {
      error.value = e?.data?.message || 'Não foi possível carregar sua conta.'
    } finally {
      loading.value = false
    }
  }

  return { data, enrollments, loading, error, refresh }
}
