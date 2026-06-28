import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Collection } from '@/types/collection'
import type { Tag } from '@/types/tags'

export const useSearchStore = defineStore('search', () => {
    const pendingCollection = ref<Collection | null>(null)
    const pendingTag = ref<Tag | null>(null)

    const setPendingCollection = (collection: Collection) => {
        pendingCollection.value = collection
    }
    const clearPendingCollection = () => {
        pendingCollection.value = null
    }

    const setPendingTag = (tag: Tag) => {
        pendingTag.value = tag
    }
    const clearPendingTag = () => {
        pendingTag.value = null
    }

    return {
        pendingCollection, setPendingCollection, clearPendingCollection,
        pendingTag, setPendingTag, clearPendingTag
    }
})