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
  max-width: 380px;
  margin: 80px auto;
  padding: 32px;
  border-radius: 16px;
  border: 1px solid var(--color-primary);
  box-shadow: 10px 10px 24px var(--shadow);
  background: var(--bg);
  transition: background 0.3s;
}

.toggle {
  display: flex;
  background: var(--color-border);
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 28px;
  gap: 4px;
}

.toggle button {
  flex: 1;
  height: 38px;
  border: none;
  border-radius: 7px;
  background: transparent;
  font-size: 14px;
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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
</style>