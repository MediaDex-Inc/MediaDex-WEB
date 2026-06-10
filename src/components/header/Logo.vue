<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

import nameLightUrl from '@/assets/name_light.png'
import nameDarkUrl from '@/assets/name_dark.png'

const theme = useThemeStore()

const logoSrc = computed(() => theme.isDark ? nameLightUrl : nameDarkUrl)
</script>

<template>
  <RouterLink to="/" class="logo">
    <img :src="logoSrc" alt="Logo" />
  </RouterLink>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
}

.logo img {
  height: 2rem;
  width: auto;
}
</style>