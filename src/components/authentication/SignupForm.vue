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
  formErrors.username = !form.username ? "Username required" : undefined
  formErrors.password = !form.password
    ? 'Password required'
    : form.password.length < 8
    ? 'Minimum of 8 characters'
    : undefined
  formErrors.passwordConfirm = form.password !== form.passwordConfirm
    ? 'The passwords do not match.'
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
        apiError.value = e instanceof Error ? e.message : 'An error occurred while creating the account.'
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <form class="form" @submit.prevent="register" novalidate>
    <div class="field">
      <label for="email">Email</label>
      <input id="email" v-model="form.email" type="email" placeholder="you@example.com" />
      <span v-if="formErrors.email" class="error">{{ formErrors.email }}</span>
    </div>

    <div class="field">
      <label for="username">Username</label>
      <input id="username" v-model="form.username" type="text" placeholder="your_username" />
      <span v-if="formErrors.username" class="error">{{ formErrors.username }}</span>
    </div>

    <div class="field">
      <label for="password">Password</label>
      <input id="password" v-model="form.password" type="password" placeholder="••••••••" autocomplete="new-password" />
      <span v-if="formErrors.password" class="error">{{ formErrors.password }}</span>
    </div>

    <div class="field">
      <label for="password-confirm">Confirm password</label>
      <input id="password-confirm" v-model="form.passwordConfirm" type="password" placeholder="••••••••" autocomplete="new-password" />
      <span v-if="formErrors.passwordConfirm" class="error">{{ formErrors.passwordConfirm }}</span>
    </div>

    <button type="submit" class="btn" :disabled="loading">
      <span v-if="loading" class="spinner"></span>
      {{ loading ? 'Account creation...' : 'Create my account' }}
    </button>

  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-label);
}

input {
  background: var(--bg-label);
  height: 2.625rem;
  border-radius: 0.5rem;
  border: 0px solid;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border: 1px solid;
  border-color: var(--color-primary);
}

.error {
  font-size: 0.75rem;
  color: var(--error);
}

.btn {
  height: 2.75rem;
  border-radius: 0.5rem;
  border: none;
  background: var(--color-primary);
  color: var(--color-border);
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 0.25rem;
}

.btn:hover { opacity: 0.9; }
.btn:active { opacity: 0.8; }
</style>