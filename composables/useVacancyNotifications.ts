interface RecentVacancy {
  id: number
  job_title: string
  openings_count: number
  created_at: string
  company?: { legal_name?: string; trade_name?: string } | null
}

const STORAGE_KEY = 'tpe_vacancy_notify_last_check'
const POLL_INTERVAL_MS = 45_000

/**
 * Notificação do navegador (Chrome) para o staff logado no painel
 * quando uma empresa cadastra uma vaga nova. Faz polling no backend
 * e usa a Notification API — exige permissão do usuário.
 */
export function useVacancyNotifications() {
  const auth = useAuthStore()
  let timer: ReturnType<typeof setInterval> | null = null
  let lastCheck: string | null = null

  async function poll() {
    try {
      const query = lastCheck ? `?after=${encodeURIComponent(lastCheck)}` : ''
      const data = await useApi<{ vacancies: RecentVacancy[]; server_time: string }>(
        `/admin/job-vacancies/recent${query}`,
      )
      for (const vacancy of data.vacancies) {
        showNotification(vacancy)
      }
      lastCheck = data.server_time
      localStorage.setItem(STORAGE_KEY, lastCheck)
    } catch {
      // sem permissão ou API indisponível — tenta de novo no próximo ciclo
    }
  }

  function showNotification(vacancy: RecentVacancy) {
    if (Notification.permission !== 'granted') return

    const companyName = vacancy.company?.legal_name || vacancy.company?.trade_name || ''
    const notification = new Notification('Nova vaga cadastrada', {
      body: `${vacancy.job_title}${companyName ? ` — ${companyName}` : ''}`,
      tag: `job-vacancy-${vacancy.id}`,
      icon: '/favicon.ico',
    })
    notification.onclick = () => {
      window.focus()
      navigateTo(`/admin/vagas-emprego/${vacancy.id}`)
      notification.close()
    }
  }

  function start() {
    if (!import.meta.client || timer) return
    if (!auth.hasModule('job_vacancies')) return
    if (!('Notification' in window)) return

    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    lastCheck = localStorage.getItem(STORAGE_KEY)
    poll()
    timer = setInterval(poll, POLL_INTERVAL_MS)
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  return { start, stop }
}
