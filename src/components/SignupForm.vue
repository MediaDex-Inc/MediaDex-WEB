<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useTokenStore } from '@/stores/token'
import { apiRegister } from '@/ts/api/auth'
import router from '@/ts/router'

interface SignupForm {
  email: string
  username: string
  password: string
  passwordConfirm: string
}

const form = reactive<SignupForm>({
  email: '',
  username: '',
  password: '',
  passwordConfirm: '',
})
const tokenStore = useTokenStore()
const loading = ref(false)
const apiError = ref<string | null>(null)
const formErrors = reactive<Partial<SignupForm>>({})

function validate(): boolean {
  formErrors.email = !form.email
    ? 'Email requis'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ? 'Email invalide'
    : undefined
  formErrors.username = !form.username ? "Nom d'utilisateur requis" : undefined
  formErrors.password = !form.password
    ? 'Mot de passe requis'
    : form.password.length < 8
    ? '8 caractères minimum'
    : undefined
  formErrors.passwordConfirm = form.password !== form.passwordConfirm
    ? 'Les mots de passe ne correspondent pas'
    : undefined
  return !Object.values(formErrors).some(Boolean)
}

const register = async () => {
    if (!validate()) return
    loading.value = true
    apiError.value = null

    try {
        const data = await apiRegister(form.email, form.username, form.password)
        tokenStore.setToken(data.access_token)
        tokenStore.setRefreshToken(data.refresh_token)
        router.push({ path: '/' })
    } catch (e: unknown) {
        apiError.value = e instanceof Error ? e.message : 'Une erreur est survenue lors de la creation du compte'
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <form class="form" @submit.prevent="register" novalidate>
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
      <input id="password" v-model="form.password" type="password" placeholder="••••••••" autocomplete="new-password" />
      <span v-if="formErrors.password" class="error">{{ formErrors.password }}</span>
    </div>

    <div class="field">
      <label for="password-confirm">Confirmer le mot de passe</label>
      <input id="password-confirm" v-model="form.passwordConfirm" type="password" placeholder="••••••••" autocomplete="new-password" />
      <span v-if="formErrors.passwordConfirm" class="error">{{ formErrors.passwordConfirm }}</span>
    </div>

    <button type="submit" class="btn" :disabled="loading">
      <span v-if="loading" class="spinner"></span>
      {{ loading ? 'Creation du compte...' : 'Créer mon compte' }}
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
  color: var(--color-border);
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