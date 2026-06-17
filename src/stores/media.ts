import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Media } from '@/types/media'
import { getMedia } from '@/ts/api/media'

export const useMediaStore = defineStore('media', () => {
  const media = ref<Media[]>([])

  const loadMediaIfNeeded = async () => {
    if (media.value.length > 0) return

    media.value = await getMedia()
  }

  const setMedia = (data: Media[]) => {
    media.value = data
  }

  return { media, loadMediaIfNeeded, setMedia }
})