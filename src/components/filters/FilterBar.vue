<script setup lang="ts">
import type { CollectionFilter } from '@/types/filters'
import type { Tag } from '@/types/tags'
import FilterRow from './FilterRow.vue';

const props = defineProps<{
    filters: CollectionFilter[]
    selectedTag: Tag | null
}>()

const emit = defineEmits<{
    'add': []
    'remove': [index: number]
    'update:filters': [filters: CollectionFilter[]]
}>()
</script>

<template>
  <div class="filters">
    <FilterRow
      v-for="(filter, index) in filters"
      :key="index"
      :filter="filter"
      @remove="emit('remove', index)"
    />

    <button class="add-filter-btn" @click="emit('add')">+ Add filter</button>

    <div class="tag" v-if="selectedTag" :style="{ backgroundColor: selectedTag?.color }">
        {{ selectedTag?.name }}
    </div>
  </div>
</template>


<style scoped>
.filters {
    display: flex;
    align-items: center;
    gap: .6rem;
    flex-wrap: wrap;
}

.add-filter-btn {
    padding: .35rem .9rem;
    border-radius: 999rem;
    border: .15rem dashed #096c6c;
    background: transparent;
    color: #096c6c;
    font-size: .8rem;
    cursor: pointer;
    transition: background .2s;
}

.add-filter-btn:hover {
    background: rgba(216,179,74,.1);
}

.tag {
    padding: .2rem .75rem;
    border-radius: 999rem;
    font-size: .8rem;
    font-weight: 500;
    color: #000;
    border: .1rem solid rgba(0,0,0,.1);
}
</style>