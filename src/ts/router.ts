import { createRouter, createWebHistory } from 'vue-router'
import ConnectionPage from '@/pages/Connection.vue'
import Home from '@/pages/Home.vue'
import Search from '@/pages/Search.vue'
import { loadRefreshToken, saveRefreshToken, saveToken } from '@/ts/saveload'
import { BASE } from '@/ts/api/helper'

const routes = [
    {
        path: '/connection',
        name: 'ConnectionPage',
        component: ConnectionPage
    },
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/search',
        name: "Search",
        component: Search
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


/**
 * Check if the token is valid and refresh it.
 * 
 * @async
 * @return {bool} - True if the token is valid, otherwise false
 */
const isTokenValid = async (): Promise<boolean> => {
    const refreshToken = loadRefreshToken()
    if (!refreshToken) return false

    try {
        const response = await fetch(`${BASE}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        })
        if (response.ok) {
            // Extend token duration if the token is valid
            const data = await response.json().catch(() => null)
            if (data?.access_token) saveToken(data.access_token)
            if (data?.refresh_token) saveRefreshToken(data.refresh_token)
        }
        return response.ok
    } catch {
        return false
    }
}

router.beforeEach(async (to) => {
    const valid = await isTokenValid()

    if (!valid && to.name !== 'ConnectionPage') return { name: 'ConnectionPage' }
    if (valid && to.name === 'ConnectionPage') return { name: 'Home' }
})

export default router