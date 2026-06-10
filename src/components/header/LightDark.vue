<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()

</script>

<template>
    <button class="theme-toggle" @click="theme.toggle">
        {{ theme.isDark ? '☀️' : '🌙' }}
    </button>
</template>

<style scoped>
button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: 0.5px solid var(--color-border);
  background: transparent;
  color: var(--text);
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.15s;
}

button:hover { background: var(--color-border); }
</style>