import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveToken, loadToken, clearToken, saveRefreshToken, loadRefreshToken, clearRefreshToken } from '@/ts/saveload'

export const useTokenStore = defineStore('token', () => {
    const token = ref<string | null>(loadToken())
    const refreshToken = ref<string | null>(loadRefreshToken())

    const setToken = (newToken: string) => {
        token.value = newToken
        saveToken(newToken)
    }

    const getToken = () => {
        return token.value
    }

    const removeToken = () => {
        token.value = null
        clearToken()
    }

    const setRefreshToken = (newRefreshToken: string) => {
        refreshToken.value = newRefreshToken
        saveRefreshToken(newRefreshToken)
    }

    const getRefreshToken = () => {
        return refreshToken.value
    }

    const removeRefreshToken = () => {
        refreshToken.value = null
        clearRefreshToken()
    }

    return {
        token,
        refreshToken,
        setRefreshToken,
        getRefreshToken,
        removeRefreshToken,
        setToken,
        getToken,
        removeToken
    }
})