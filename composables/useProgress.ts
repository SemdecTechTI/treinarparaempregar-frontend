export function useProgress() {
  let throttleTimer: ReturnType<typeof setTimeout> | null = null

  async function saveAcervoProgress(acervoVideoId: number, currentTime: number, duration: number, immediate = false) {
    const send = async () => {
      try {
        await useApi('/acervo-progress', {
          method: 'POST',
          body: { acervo_video_id: acervoVideoId, current_time: currentTime, duration },
        })
      } catch (e) {
        console.error('Erro ao salvar progresso do acervo', e)
      }
    }

    if (immediate) {
      if (throttleTimer) clearTimeout(throttleTimer)
      return send()
    }

    if (throttleTimer) return
    throttleTimer = setTimeout(() => {
      send()
      throttleTimer = null
    }, 8000)
  }

  async function getAcervoProgress(acervoVideoId: number) {
    try {
      const data = await useApi<{ progress: { watched_seconds: number } | null }>(`/acervo-progress/${acervoVideoId}`)
      return data.progress?.watched_seconds ?? 0
    } catch {
      return 0
    }
  }

  function saveProgress(
    acervoVideoId: number,
    currentTime: number,
    duration: number,
    immediate = false,
    type: 'acervo_video' = 'acervo_video',
  ) {
    if (type === 'acervo_video') {
      return saveAcervoProgress(acervoVideoId, currentTime, duration, immediate)
    }
    return saveAcervoProgress(acervoVideoId, currentTime, duration, immediate)
  }

  async function getProgress(acervoVideoId: number, type: 'acervo_video' = 'acervo_video') {
    if (type === 'acervo_video') {
      return getAcervoProgress(acervoVideoId)
    }
    return getAcervoProgress(acervoVideoId)
  }

  return {
    saveProgress,
    getProgress,
    saveAcervoProgress,
    getAcervoProgress,
  }
}
