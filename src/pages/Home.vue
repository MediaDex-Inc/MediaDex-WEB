<script setup lang="ts">
import { getCollections } from '@/ts/api/collections';
import { getTags } from '@/ts/api/tags';
import { ref, computed, onMounted } from 'vue';
import type { Collection } from '@/types/collection';
import type { Tags } from '@/types/tags';

const apiErrorCollection = ref<string | null>(null)
const loadingCollection = ref(false)

const apiErrorTags = ref<string | null>(null)
const loadingTags = ref(false)

const collectionsData = ref<Collection[]>([])
const tagsData = ref<Tags[]>([])

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

    <div class="collection-stack">
        <div
        class="collection-card"
        v-for="collection in filteredCollections"
        :key="collection.name"
        >
        <h3>{{ collection.name }}</h3>
        <p>{{ collection.filters }}</p>
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
        <span
          class="tag"
          v-for="tag in filteredTags"
          :key="tag.name"
          :style="{ backgroundColor: tag.color }"
        >
          {{ tag.name }}
        </span>
      </div>
    </section>

  </div>
</template>

<style lang="css" scoped>
.page {
    display: flex;
    justify-content: center;
    padding: 1.25rem;
    gap: 15vw;
}

.panel {
    flex: 0 0 40%;
    max-width: 30%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.panel h1 {
    text-align: center;
    font-size: 1.4rem;
    margin-bottom: 0.625rem;
    letter-spacing: 0.03em;
}

.panel h1::after {
    content: "";
    display: block;
    width: 2.5rem;
    height: 0.125rem;
    background: var(--color-primary);
    margin: 0.5rem auto 0;
    border-radius: 0.125rem;
    opacity: 0.7;
}

/* INPUT */
input {
    padding: 0.625rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid var(--color-border);
    background: var(--bg-label);
    color: var(--text);
    outline: none;
}


.collection-stack {
    max-height: 70vh;
    overflow-y: auto;
    overflow-x: hidden;

    padding: 0.625rem 0.625rem 2.5rem;

    scrollbar-width: thin;
    scrollbar-color: var(--color-primary) transparent;
}

.collection-stack::after {
    content: "";
    display: block;
    height: 7.5rem;
}


.collection-card {
    height: 10rem;
    background: var(--color-primary);
    color: #ededed;
    padding: 0.875rem;
    border-radius: 0.875rem;

    margin-bottom: 0.75rem;

    position: relative;
    z-index: 1;

    box-shadow: 0 0.5rem 1.25rem var(--shadow);

    transform-origin: top center;

    transition: transform 0.25s ease, filter 0.25s ease, opacity 0.25s ease;

    will-change: transform;
}

.collection-card:not(:hover) {
    filter: grayscale(0.4);
}

.collection-card:not(:first-child) {
    margin-top: -8.125rem;
}


.collection-card p {
    margin-top: 10%;
}


.collection-card:hover {
    transform: scale(1.03);
    z-index: 999;

    filter: grayscale(0);
    opacity: 1;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag {
    padding: 0.375rem 0.625rem;
    border-radius: 0.3125rem;
    font-size: 0.85rem;
    color: white;
    box-shadow: 0 0.125rem 0.375rem var(--shadow);
    user-select: none;
}


@media (max-width: 900px) {
    .panel {
        flex: 1;
        max-width: 100%;
    }

    .page {
        flex-direction: column;
    }
}
</style>