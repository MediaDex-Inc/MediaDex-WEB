<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useTokenStore } from '@/stores/token'
import { apiLogin } from '@/ts/api/auth'
import router from '@/ts/router'


interface LoginForm {
  email: string
  username: string
  password: string
}

const form = reactive<LoginForm>({
  email: '',
  username: '',
  password: '',
})

const tokenStore = useTokenStore()
const loading = ref(false)
const apiError = ref<string | null>(null)
const formErrors = reactive<Partial<LoginForm>>({})

function validate(): boolean {
  formErrors.email = !form.email
    ? 'Email requis'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ? 'Email invalide'
    : undefined
  formErrors.username = !form.username ? "Nom d'utilisateur requis" : undefined
  formErrors.password = !form.password ? 'Mot de passe requis' : undefined
  return !Object.values(formErrors).some(Boolean)
}

const connection = async () => {
    if (!validate()) return
    loading.value = true
    apiError.value = null

    try {
        const data = await apiLogin(form.email, form.username, form.password)
        tokenStore.setToken(data.access_token)
        tokenStore.setRefreshToken(data.refresh_token)
        router.push({ path: '/' })
    } catch (e: unknown) {
        apiError.value = e instanceof Error ? e.message : 'Une erreur est survenue lors de la connexion'
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <form class="form" @submit.prevent="connection" novalidate>
    <div class="field">
      <label for="email">Email</label>
      <input id="email" v-model="form.email" type="email" placeholder="vous@exemple.com" />
      <span v-if="formErrors.email" class="error">{{ formErrors.email }}</span>
    </div>

    <div class="field">
      <label for="username">Nom d'utilisateur</label>
      <input id="username" v-model="form.username" type="text" placeholder="votre_pseudo" />
      <span v-if="formErrors.username" class="error">{{ formErrors.username }}</span>
    </div>

    <div class="field">
      <label for="password">Mot de passe</label>
      <input id="password" v-model="form.password" type="password" placeholder="••••••••" autocomplete="current-password" />
      <span v-if="formErrors.password" class="error">{{ formErrors.password }}</span>
    </div>

    <p v-if="apiError" style="color: var(--error)">{{ apiError }}</p>

    <button type="submit" class="btn" :disabled="loading">
      <span v-if="loading" class="spinner"></span>
      {{ loading ? 'Connection…' : 'Se connecter' }}
    </button>
  </form>
</template>

<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

label {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-label);
}

input {
    background: var(--bg-label);
    height: 42px;
    border-radius: 8px;
    border: 0px solid;
    padding: 0 12px;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
}

input:focus {
    border: 1px solid;
    border-color: var(--color-primary);
}

.error {
    font-size: 12px;
    color: var(--error);
}

.btn {
    height: 44px;
    border-radius: 8px;
    border: none;
    background: var(--color-primary);
    color: #ededed;
    font-size: 15px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: opacity 0.2s;
    margin-top: 4px;
}

.btn:hover { opacity: 0.9; }
.btn:active { opacity: 0.8; }
</style>