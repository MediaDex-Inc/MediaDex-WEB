<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { toRaw } from 'vue'

import { getMediaByTagId, getTags } from '@/ts/api/tags'
import { getCollections } from '@/ts/api/collections'
import { getMedia } from '@/ts/api/media'

import type { Collection } from '@/types/collection'
import type { CollectionFilter } from '@/types/filters'
import type { Tags } from '@/types/tags'

import { formatOp } from '@/ts/utils/filters'
import { AVAILABLE_FILTERS, FILTER_OPERATORS } from '@/ts/constants/filters'
import { useMediaStore } from '@/stores/media'

/* ---------------- state ---------------- */

const store = useMediaStore()
const search = ref('')
const selectedTagName = ref('')
const selectedCollectionName = ref('')

const collections = ref<Collection[]>([])
const tags = ref<Tags[]>([])

const editableFilters = ref<CollectionFilter[]>([])

/* ---------------- derived ---------------- */
const normalizeKey = (key: string) => key.charAt(0).toLowerCase() + key.slice(1)

const selectedCollection = computed(() =>
    collections.value.find(c => c.name === selectedCollectionName.value) ?? null
)

const selectedTag = computed(() =>
    tags.value.find(c => c.name === selectedTagName.value) ?? null
)

/* ---------------- logic ---------------- */
const toNumber = (v: any) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : null
}

const compare = (field: any, op: string, value: string) => {

    if (field == null || value == null) return false

    switch (op) {
        case 'eq':
        return String(field) === value

        case 'ne':
        return String(field) !== value

        case 'contains':
        return String(field).includes(value)

        case 'gt': {
        const a = toNumber(field)
        const b = toNumber(value)
        return a !== null && b !== null && a > b
        }

        case 'lt': {
        const a = toNumber(field)
        const b = toNumber(value)
        return a !== null && b !== null && a < b
        }

        case 'ge': {
        const a = toNumber(field)
        const b = toNumber(value)
        return a !== null && b !== null && a >= b
        }

        case 'le': {
        const a = toNumber(field)
        const b = toNumber(value)
        return a !== null && b !== null && a <= b
        }

        default:
        return false
    }
}

const filteredMedia = computed(() => {
  const filters = editableFilters.value.filter(f => f.Key && f.ops && f.Value)

  return store.media
    .filter(item =>
      filters.every(f => {
        const field = item[normalizeKey(f.Key)]
        return compare(field, f.ops, f.Value)
      })
    )
    .filter(item => {
      if (!search.value.trim()) return true

      return item.name
        ?.toLowerCase()
        .includes(search.value.toLowerCase())
    })
})

/* ---------------- API ---------------- */

const getAllMedia = async () => {
    try {
        store.setMedia(await getMedia());
    } catch (e) {
        console.log(e)
    }
}

const getAllCollections = async () => {
    try {
        collections.value = await getCollections()
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
    console.log(raw)

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
        <option value="">Auncun Tags</option>
        <option v-for="tag in tags" :key="tag.id" :value="tag.name">
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

    <div class="filters">
      <div
        v-for="(filter, index) in editableFilters"
        :key="index"
        class="filter-row"
      >
        <select v-model="filter.Key">
          <option value="">Field</option>
          <option v-for="k in AVAILABLE_FILTERS" :key="k" :value="k">
            {{ k }}
          </option>
        </select>

        <select v-model="filter.ops">
          <option value="">Op</option>
          <option v-for="op in FILTER_OPERATORS" :key="op" :value="op">
            {{ formatOp(op) }}
          </option>
        </select>

        <input v-model="filter.Value" placeholder="value..." />
      </div>
          <div class="tag" :style="{ backgroundColor: selectedTag?.color }">
        {{ selectedTag?.name }}
    </div>
    </div>
  </header>

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