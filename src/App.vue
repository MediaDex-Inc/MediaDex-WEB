<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useTokenStore } from '@/stores/token'
import Logo from '@/components/Logo.vue'

const router = useRouter()
const theme = useThemeStore()
const token = useTokenStore()
theme.init()

// Change favicon base on selected theme
watch(
  () => theme.isDark,
  (dark) => {
    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement
    link.href = dark ? '/src/assets/logo_light.png' : '/src/assets/logo_dark.png'
  },
  { immediate: true }
)
</script>

<template>
    <header>
        <Logo />
        <button class="theme-toggle" @click="theme.toggle">
            {{ theme.isDark ? '☀️' : '🌙' }}
        </button>
    </header>
    <RouterView />
</template>

<style scoped>
</style>
