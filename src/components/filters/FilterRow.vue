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

<style scoped>
.filter-row {
    display: flex;
    align-items: center;
    gap: .4rem;
    padding: .35rem .9rem;
    border-radius: 999rem;
    border: .15rem solid #096c6c;
    background: rgba(216,179,74,.08);
    font-size: .8rem;
}

.filter-row select,
.filter-row input {
    border: none;
    background: transparent;
    color: inherit;
    font-size: .8rem;
    outline: none;
    cursor: pointer;
}

.remove-btn {
    cursor: pointer;
    color: #096c6c;
    font-weight: 500;
    background: none;
    border: none;
    font-size: .9rem;
    padding: 0 .2rem;
}
.remove-filter-btn {
    padding: .2rem .5rem;
    border-radius: 999rem;
    border: none;
    background: transparent;
    color: #096c6c;
    font-size: .85rem;
    cursor: pointer;
    font-weight: 500;
    transition: background .2s, color .2s;
    line-height: 1;
}

.remove-filter-btn:hover {
    background: rgba(216,179,74,.2);
    color: #a07a1a;
}
</style>