<script setup lang="ts">
import Header from '@/components/header/Header.vue'

</script>

<template>
    <Header />
    <main>
        <RouterView />
    </main>
</template>

<style scoped>
main {
    height: calc(100vh - 3.5rem);
    padding: 1rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
