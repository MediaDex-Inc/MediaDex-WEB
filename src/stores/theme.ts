import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const isDark = ref(localStorage.getItem('theme') === 'dark')

    function toggle() {
        isDark.value = !isDark.value
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
        document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
    }

    function init() {
        document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
    }

    return { isDark, toggle, init }
})