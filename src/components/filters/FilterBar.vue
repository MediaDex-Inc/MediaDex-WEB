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

    <div class="tag" :style="{ backgroundColor: selectedTag?.color }">
      {{ selectedTag?.name }}
    </div>
  </div>
</template>
<!-- <template>
  <div class="filters">
    <div
      v-for="(filter, index) in filters"
      :key="index"
      class="filter-row"
    >
      <select v-model="filter.Key">
        <option value="">Field</option>
        <option v-for="k in AVAILABLE_FILTERS" :key="k" :value="k">{{ k }}</option>
      </select>

      <select v-model="filter.ops">
        <option value="">Op</option>
        <option v-for="op in FILTER_OPERATORS" :key="op" :value="op">{{ formatOp(op) }}</option>
      </select>

      <input v-model="filter.Value" placeholder="value..." />
      <button class="remove-filter-btn" @click="emit('remove', index)">✕</button>
    </div>

    <button class="add-filter-btn" @click="emit('add')">+ Add filter</button>

    <div class="tag" :style="{ backgroundColor: selectedTag?.color }">
      {{ selectedTag?.name }}
    </div>
  </div>
</template> -->

<style scoped>

</style>