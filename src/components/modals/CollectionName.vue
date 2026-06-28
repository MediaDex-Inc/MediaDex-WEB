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

<style>

/* Modal name plus confirm */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 300px;
}

.modal input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>