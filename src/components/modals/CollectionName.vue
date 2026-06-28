<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    show: boolean;
}>();

const emit = defineEmits<{
    'update:show': [value: boolean];
    'confirm-save': [name: string];
}>();

const collectionName = ref('');

function confirmSave() {
    if (!collectionName.value.trim()) return;
    emit('confirm-save', collectionName.value.trim());
    collectionName.value = '';
    emit('update:show', false);
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="emit('update:show', false)">
    <div class="modal">
      <h3>Name your new collection</h3>
      <span>(tag are not save)</span>
      <input
        v-model="collectionName"
        placeholder="Ex: My favorite romance..."
        @keyup.enter="confirmSave"
        autofocus
      />
      <div class="modal-actions">
        <button @click="emit('update:show', false)">Annuler</button>
        <button class="btn-confirm" @click="confirmSave" :disabled="!collectionName.trim()">
          Validate
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}

.modal {
    background: var(--bg-label);
    border-radius: 1.25rem;
    border: .25rem solid #096c6c;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    min-width: 22rem;
    box-shadow: 0 1.5rem 3rem var(--shadow),
                inset 0 0 1rem rgba(255,255,255,.08);
}

.modal h3 {
    font-size: clamp(1.1rem, 1.4vw, 1.5rem);
    font-weight: 500;
    color: var(--color-primary);
    text-align: center;
}

.modal span {
    font-size: .85rem;
    color: var(--color-label);
    text-align: center;
    font-style: italic;
}

.modal input {
    padding: .55rem 1rem;
    border-radius: 999rem;
    border: .15rem solid var(--color-border);
    background: transparent;
    color: var(--text);
    font-size: .9rem;
    outline: none;
    transition: border-color .2s;
}

.modal input:focus {
    border-color: #096c6c;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: .75rem;
}

.modal-actions button {
    padding: .45rem 1.25rem;
    border-radius: 999rem;
    border: .15rem solid var(--color-border);
    background: transparent;
    color: var(--text);
    font-size: .85rem;
    cursor: pointer;
    transition: all .2s;
}

.modal-actions button:hover {
    border-color: #096c6c;
    color: #096c6c;
}

.btn-confirm {
    border-color: #096c6c !important;
    color: #096c6c !important;
}

.btn-confirm:hover:not(:disabled) {
    background: #096c6c !important;
    color: white !important;
}

.btn-confirm:disabled {
    opacity: .4;
    cursor: not-allowed;
}
</style>