export function useProgress() {
  let throttleTimer: ReturnType<typeof setTimeout> | null = null

  async function saveCourseVideoProgress(courseVideoId: number, currentTime: number, duration: number, immediate = false) {
    const send = async () => {
      try {
        await useApi('/course-video-progress', {
          method: 'POST',
          body: { course_video_id: courseVideoId, current_time: currentTime, duration },
        })
      } catch (e) {
        console.error('Erro ao salvar progresso do vídeo', e)
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

  async function getCourseVideoProgress(courseVideoId: number) {
    try {
      const data = await useApi<{ progress: { watched_seconds: number } | null }>(`/course-video-progress/${courseVideoId}`)
      return data.progress?.watched_seconds ?? 0
    } catch {
      return 0
    }
  }

  function saveProgress(
    courseVideoId: number,
    currentTime: number,
    duration: number,
    immediate = false,
    type: 'course_video' = 'course_video',
  ) {
    if (type === 'course_video') {
      return saveCourseVideoProgress(courseVideoId, currentTime, duration, immediate)
    }
    return saveCourseVideoProgress(courseVideoId, currentTime, duration, immediate)
  }

  async function getProgress(courseVideoId: number, type: 'course_video' = 'course_video') {
    if (type === 'course_video') {
      return getCourseVideoProgress(courseVideoId)
    }
    return getCourseVideoProgress(courseVideoId)
  }

  return {
    saveProgress,
    getProgress,
    saveCourseVideoProgress,
    getCourseVideoProgress,
  }
}
