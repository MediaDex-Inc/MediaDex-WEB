<script setup lang="ts">
import { useTokenStore } from '@/stores/token'

const tokenStore = useTokenStore()

function logout() {
  tokenStore.setToken('')
  tokenStore.setRefreshToken('')
}
</script>

<template>
  <button @click="logout"><span>Log out</span></button>
</template>

<style scoped>
button {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  height: 2rem;
  padding: 0 0.75rem;
  border-radius: 0.5rem;
  border: 0.5px solid var(--color-border);
  background: var(--color-primary);
  color: #ededed;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: background 0.15s;
}

button:hover { opacity: 0.8; }
</style>