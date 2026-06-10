<script setup lang="ts">
import { watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useTokenStore } from '@/stores/token'
import Logo from '@/components/header/Logo.vue'
import Logout from '@/components/header/Logout.vue'
import LightDark from '@/components/header/LightDark.vue'

const router = useRouter()
const theme = useThemeStore()
const token = useTokenStore()
theme.init()

const isLogin = computed(() => !!token.getToken()?.trim())
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
        <div class="header-right">
            <LightDark />
            <Logout v-if="isLogin" />
        </div>
    </header>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 3.5rem;
  border-bottom: 0.5px solid var(--color-border);
  background: var(--bg);
  transition: background 0.3s;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>