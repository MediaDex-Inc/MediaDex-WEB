<script setup lang="ts">
import { AVAILABLE_FILTERS, FILTER_OPERATORS } from '@/ts/constants/filters'
import { formatOp } from '@/ts/utils/filters'
import type { CollectionFilter } from '@/types/filters'

const props = defineProps<{
  filter: CollectionFilter
}>()

const emit = defineEmits<{
  'remove': []
}>()
</script>

<template>
    <div class="filter-row">
        <select v-model="filter.Key">
            <option value="">Field</option>
            <option v-for="k in AVAILABLE_FILTERS" :key="k" :value="k">{{ k }}</option>
        </select>

        <select v-model="filter.ops">
            <option value="">Op</option>
            <option v-for="op in FILTER_OPERATORS" :key="op" :value="op">{{ formatOp(op) }}</option>
        </select>

        <input v-model="filter.Value" placeholder="value..." />
        <button class="remove-filter-btn" @click="emit('remove')">✕</button>
    </div>
</template>