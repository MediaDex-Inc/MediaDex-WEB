<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { toRaw } from 'vue'

import CollectionName from '@/components/modals/CollectionName.vue'
import FilterBar from '@/components/filters/FilterBar.vue'

import { getMediaByTagId, getTags } from '@/ts/api/tags'
import { getMedia } from '@/ts/api/media'

import { useMediaStore } from '@/stores/media'

import { useFilters } from '@/composables/useFilter'
import { useCollections } from '@/composables/useCollection'
import type { Tag } from '@/types/tags'
import { useSearchStore } from '@/stores/search'
import router from '@/ts/router'

/* ---------------- state ---------------- */
const searchStore = useSearchStore()
const store = useMediaStore()
const selectedTagName = ref('')
const selectedCollectionName = ref('')

const tags = ref<Tag[]>([])


const selectedCollection = computed(() =>
    collections.value.find(c => c.name === selectedCollectionName.value) ?? null
)

const selectedTag = computed(() =>
    tags.value.find(c => c.name === selectedTagName.value) ?? null
)

/* ---------------- logic ---------------- */
const { search, editableFilters, filteredMedia } = useFilters();
const { collections, showNameModal, getAllCollections, saveFilters, confirmSave } = useCollections(editableFilters);
const getMediaEmoji = (type: string): string => {
    switch (type) {
        case 'Film':  return '🎬'
        case 'Shows': return '📺'
        case 'Books': return '📚'
        case 'Game':  return '🎮'
        default:      return '🎬'
    }
}

/* ---------------- API ---------------- */

const getAllMedia = async () => {
    try {
        store.setMedia(await getMedia());
    } catch (e) {
        console.log(e)
    }
}

const getMediaByTag = async (tagId: number) => {
    try {
        store.setMedia(await getMediaByTagId(tagId));
    } catch (e) {
        console.log(e)
    }
}

const getAllTags = async () => {
    try {
        tags.value = await getTags()
    } catch (e) {
        console.log(e)
    }
}

/* ---------------- watchers ---------------- */

watch(selectedTag, (tag) => {
    if (tag) {
        getMediaByTag(tag?.tag_id);
        return
    } else {
        getAllMedia();
        return
    }
});

watch(selectedCollection, (col) => {
    if (!col) {
        editableFilters.value = [{ Key: '', ops: '', Value: '' }]
        return
    }

    const raw = toRaw(col.filters)

    editableFilters.value = raw.map(f => ({ ...f }))
})

/* ---------------- lifecycle ---------------- */
onMounted(() => {
    editableFilters.value = [{ Key: '', ops: '', Value: '' }]
    store.loadMediaIfNeeded()
    getAllCollections()
    getAllTags()

    if (searchStore.pendingCollection) {
        const raw = toRaw(searchStore.pendingCollection.filters)
        editableFilters.value = raw.map(f => ({ ...f }))
        selectedCollectionName.value = searchStore.pendingCollection.name
        searchStore.clearPendingCollection()
    }

    if (searchStore.pendingTag) {
        selectedTagName.value = searchStore.pendingTag.name
        searchStore.clearPendingTag()
    }
})
</script>

<template>
<div class="search-page">
  <header class="header">
    <div class="top-row">
      <input v-model="search" placeholder="Search..." />

      <select v-model="selectedTagName">
        <option value="">No tag selected</option>
        <option v-for="tag in tags" :key="tag.tag_id" :value="tag.name">
          {{ tag.name }}
        </option>
      </select>

      <select v-model="selectedCollectionName">
        <option value="">No collection selected</option>
        <option v-for="c in collections" :key="c.name" :value="c.name">
          {{ c.name }}
        </option>
      </select>
    </div>
    <FilterBar
        :filters="editableFilters"
        :selected-tag="selectedTag"
        @add="editableFilters.push({ Key: '', ops: '', Value: '' })"
        @remove="(i) => editableFilters.splice(i, 1)"
    />
    <button class="save-btn" @click="saveFilters">Save</button>
  </header>
    <CollectionName v-model:show="showNameModal" @confirm-save="confirmSave" />

    <main>
        <div
            class="media-item"
            v-for="m in filteredMedia"
            :key="m.media_id"
            @click="router.push(`/media/${m.media_id}`)"
        >
            <img v-if="m.img_url" class="media-thumb" :src="m.img_url" :alt="m.name" />
            <div v-else class="media-thumb" style="background: rgba(216,179,74,.15); display:flex; align-items:center; justify-content:center;">
                {{ getMediaEmoji(m.media_type) }}
            </div>
            <div class="media-info">
                <span class="media-name">{{ m.name }}</span>
                <div class="media-meta">
                    <span class="badge badge-type">{{ m.media_type }}</span>
                    <span class="badge badge-status">{{ m.status }}</span>
                    <span class="badge badge-rating">⭐ {{ m.rating ?? '-' }}</span>
                </div>
            </div>
        </div>
    </main>
</div>
</template>
<style scoped>
.search-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.header {
    flex-shrink: 0;
    border-bottom: .25rem solid #096c6c;
    padding: 1rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: .75rem;
    background: linear-gradient(145deg, rgba(255,255,255,.08), rgba(255,255,255,.02));
}

main {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 1rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: .6rem;
    scrollbar-width: thin;
    scrollbar-color: #096c6c transparent;
}

.top-row {
    display: flex;
    gap: .75rem;
    align-items: center;
}

.top-row input {
    flex: 2;
    padding: .5rem 1rem;
    border-radius: 999rem;
    border: .15rem solid #096c6c;
    background: transparent;
    color: inherit;
    font-size: .9rem;
    outline: none;
}

.top-row select {
    flex: 1;
    padding: .5rem 1rem;
    border-radius: 999rem;
    border: .15rem solid var(--color-border);
    background: transparent;
    color: inherit;
    font-size: .85rem;
    outline: none;
    appearance: none;
    cursor: pointer;
}

.save-btn {
    align-self: flex-end;
    padding: .45rem 1.25rem;
    border-radius: 999rem;
    border: .15rem solid #096c6c;
    background: transparent;
    color: #096c6c;
    font-size: .85rem;
    cursor: pointer;
    font-weight: 500;
    transition: all .2s;
}

.save-btn:hover {
    background: #096c6c;
    color: white;
}

.media-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: .75rem 1rem;
    border-radius: 1rem;
    border: .15rem solid var(--color-border);
    background: linear-gradient(145deg, rgba(255,255,255,.06), rgba(255,255,255,.01));
    cursor: pointer;
    transition: border-color .2s, box-shadow .2s;
    text-decoration: none;
    color: inherit;
}

.media-item:hover {
    border-color: #096c6c;
    box-shadow: 0 .25rem 1rem rgba(216,179,74,.2);
}

.media-thumb {
    width: 3.5rem;
    height: 4.5rem;
    object-fit: cover;
    border-radius: .6rem;
    border: .15rem solid #096c6c;
    flex-shrink: 0;
}

.media-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: .3rem;
    min-width: 0;
}

.media-name {
    font-size: .95rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.media-meta {
    display: flex;
    gap: .5rem;
    flex-wrap: wrap;
}

.badge {
    padding: .2rem .65rem;
    border-radius: 999rem;
    font-size: .75rem;
    font-weight: 500;
}

.badge-type {
    background: rgba(216,179,74,.15);
    color: #a07a1a;
    border: .1rem solid #096c6c;
}

.badge-status {
    background: rgba(30,180,100,.12);
    color: #0e6e38;
    border: .1rem solid #1db36a;
}

.badge-rating {
    background: transparent;
    color: var(--color-secondary);
    border: .1rem solid var(--color-border);
}
</style>