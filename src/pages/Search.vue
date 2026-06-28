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

/* ---------------- state ---------------- */

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

    store.loadMediaIfNeeded();
    getAllCollections()
    getAllTags()
})
</script>

<template>
  <header class="header">
    <div class="top-row">
      <input v-model="search" placeholder="Rechercher..." />

      <select v-model="selectedTagName">
        <option value="">Auncun Tag</option>
        <option v-for="tag in tags" :key="tag.tag_id" :value="tag.name">
          {{ tag.name }}
        </option>
      </select>

      <select v-model="selectedCollectionName">
        <option value="">Aucune collection</option>
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
    <button class="save-btn" @click="saveFilters">Sauvegarder</button>
  </header>
    <CollectionName v-model:show="showNameModal" @confirm-save="confirmSave" />

  <main>
    <div v-for="m in filteredMedia" :key="m.media_id">
      {{ m.name }} - {{ m.status }} - {{ m.rating }}
    </div>
  </main>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  padding: 1rem;
  margin-bottom: 1rem;
}

.top-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-wrapper {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;

  padding: 0.75rem 1rem;

  background: var(--bg-label);
  color: var(--text);

  border: 1px solid var(--color-border);
  border-radius: 12px;

  outline: none;
  transition: 0.2s;
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
}

.select {
  min-width: 180px;

  padding: 0.75rem 1rem;

  background: var(--bg-label);
  color: var(--text);

  border: 1px solid var(--color-border);
  border-radius: 12px;

  cursor: pointer;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-chip {
  padding: 0.45rem 0.85rem;

  background: var(--color-primary);
  color: white;

  border-radius: 999px;

  font-size: 0.85rem;
  font-weight: 500;

  white-space: nowrap;
}

.media {
  min-height: 400px;
}
</style>