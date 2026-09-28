import { loadTracks } from '~/utils/tracks'

export function usePublicTracks() {
  return useAsyncData('public-tracks', loadTracks)
}
