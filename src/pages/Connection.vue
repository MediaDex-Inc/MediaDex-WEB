<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue';
import SignupForm from '@/components/SignupForm.vue';
import { ref } from 'vue'


const isSignup = ref(false)
</script>

<template>
  <section id="connection">
    <div class="toggle">
      <button :class="{ active: !isSignup }" @click="isSignup = false">Connexion</button>
      <button :class="{ active: isSignup }" @click="isSignup = true">Inscription</button>
    </div>

    <LoginForm v-if="!isSignup" />
    <SignupForm v-else />
  </section>
</template>

<style scoped>
#connection {
  max-width: 24rem;
  margin: 20vh auto;
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--color-primary);
  box-shadow: 0.5rem 0.5rem 1.5rem var(--shadow);
  background: var(--bg);
  transition: background 0.3s;
}

.toggle {
  display: flex;
  background: var(--color-border);
  border-radius: 0.625rem;
  padding: 0.25rem;
  margin-bottom: 1.75rem;
  gap: 0.25rem;
}

.toggle button {
  flex: 1;
  height: 2.375rem;
  border: none;
  border-radius: 0.4rem;
  background: transparent;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-label);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  font-family: inherit;
}

.toggle button.active {
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--color-primary);
  box-shadow: 0 1px 0.25rem rgba(0, 0, 0, 0.1);
}
</style>