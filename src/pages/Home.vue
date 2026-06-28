<script setup lang="ts">
import { getCollections } from '@/ts/api/collections';
import { getTags } from '@/ts/api/tags';
import { ref, computed, onMounted } from 'vue';
import type { Collection } from '@/types/collection';
import type { Tag } from '@/types/tags';
import { useSearchStore } from '@/stores/search';
import { useRouter } from 'vue-router';

const searchStore = useSearchStore()
const router = useRouter()

const apiErrorCollection = ref<string | null>(null)
const loadingCollection = ref(false)

const apiErrorTags = ref<string | null>(null)
const loadingTags = ref(false)

const collectionsData = ref<Collection[]>([])
const tagsData = ref<Tag[]>([])

const goToSearch = (collection: Collection) => {
    searchStore.setPendingCollection(collection)
    router.push('/search')
}
const goToSearchByTag = (tag: Tag) => {
    searchStore.setPendingTag(tag)
    router.push('/search')
}
const inputCollection = ref('')
const filteredCollections = computed(() => {
    return collectionsData.value.filter(collection =>
        collection.name.toLowerCase().includes(inputCollection.value.toLowerCase())
    )
})

const inputTags = ref('')
const filteredTags = computed(() => {
    return tagsData.value.filter(tag =>
        tag.name.toLowerCase().includes(inputTags.value.toLowerCase())
    )
})
const formatFilters = (filters: string | object[]): string => {
  try {
    const arr = typeof filters === 'string' ? JSON.parse(filters) : filters
    return arr.map((f: { Key: string; ops: string; Value: string }) =>
      `${f.Key}: ${f.Value}`
    ).join(' · ')
  } catch {
    return ''
  }
}

const collections = async () => {
    loadingCollection.value = true
    apiErrorCollection.value = null

    try {
        collectionsData.value = await getCollections()
    } catch (e: unknown) {
        apiErrorCollection.value =
            e instanceof Error
                ? e.message
                : "Une erreur est survenue lors de la récupération des collections"
    } finally {
        loadingCollection.value = false
    }
}


const tags = async () => {
    loadingTags.value = true
    apiErrorTags.value = null

    try {
        tagsData.value = await getTags()
    } catch (e: unknown) {
        apiErrorTags.value =
            e instanceof Error
                ? e.message
                : "Une erreur est survenue lors de la récupération des tags"
    } finally {
        loadingTags.value = false
    }
}

onMounted(() => {
    collections()
    tags()
})

</script>

<template>
  <div class="page">

    <!-- LEFT : Collections -->
    <section class="panel">
    <h1>Collections</h1>

    <input
        type="text"
        v-model="inputCollection"
        placeholder="Search Collections..."
    />

    <div class="scroll-area">
        <div
            class="collection-card"
            v-for="collection in filteredCollections"
            :key="collection.name"
            @click="goToSearch(collection)"
            style="cursor: pointer"
        >
            <h3>{{ collection.name }}</h3>
            <p>{{ formatFilters(collection.filters) }}</p>
        </div>
    </div>
    </section>

    <!-- RIGHT : Tags -->
    <section class="panel">
      <h1>Tags</h1>

      <input
        type="text"
        v-model="inputTags"
        placeholder="Search Tags..."
      />

      <span v-if="loadingTags" class="spinner"></span>
      <p v-else-if="apiErrorTags">{{ apiErrorTags }}</p>

    <div class="tags-container">
        <div class="tags-container">
            <span
                class="tag"
                v-for="tag in filteredTags"
                :key="tag.name"
                :style="{ backgroundColor: tag.color }"
                @click="goToSearchByTag(tag)"
                style="cursor: pointer"
            >
                {{ tag.name }}
            </span>
        </div>
    </div>
    </section>

  </div>
</template>
<style scoped>
.page {
    --gold: #096c6c;
    --gold-dim: rgba(216, 179, 74, .15);
    --gold-glow: rgba(216, 179, 74, .2);

    height: 100%;
    display: flex;
    overflow: hidden;
}

.panel {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    padding: 1.25rem 1.5rem;
    gap: .75rem;
    overflow: hidden;
}

.panel:first-child {
    border-right: .25rem solid var(--gold);
}

.panel h1 {
    font-size: 1.05rem;
    font-weight: 500;
    color: var(--gold);
    padding-bottom: .6rem;
    border-bottom: .1rem solid rgba(216, 179, 74, .25);
    flex-shrink: 0;
}

/* ── Inputs ── */
.panel input[type="text"] {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
    flex-shrink: 0;
    padding: .45rem 1rem;
    border-radius: 999rem;
    border: .15rem solid var(--gold);
    background: transparent;
    color: inherit;
    font-size: .85rem;
    outline: none;
}

/* ── Zone scrollable ── */
.scroll-area {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    scrollbar-width: thin;
    scrollbar-color: var(--gold) transparent;
}

/* ── Cards collections ── */
.collection-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: .2rem;
    padding: .75rem .9rem;
    border-radius: .85rem;
    border: .15rem solid var(--color-border);
    background: rgba(255, 255, 255, .04);
    cursor: pointer;
    transition: border-color .2s, box-shadow .2s;
    flex-shrink: 0;
}

.collection-card:hover {
    border-color: var(--gold);
    box-shadow: 0 .2rem .8rem var(--gold-glow);
}

.collection-card h3 {
    font-size: .9rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.collection-card p {
    font-size: .75rem;
    color: var(--color-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
}

/* ── Tags ── */
.tags-container {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: .5rem;
    scrollbar-width: thin;
    scrollbar-color: var(--gold) transparent;
    padding: 4px;
}

.tag {
    display: inline-flex;
    align-items: center;
    padding: .25rem .75rem;
    border-radius: 999rem;
    font-size: .78rem;
    font-weight: 500;
    cursor: pointer;
    border: .1rem solid;
    transition: box-shadow .15s, transform .1s;
}

.tag:hover {
    transform: scale(1.04);
    box-shadow: 0 .15rem .5rem var(--gold-glow);
}

/* ── Spinner ── */
.spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(216, 179, 74, .3);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin .7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>