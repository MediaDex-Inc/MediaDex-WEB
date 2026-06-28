<script setup lang="ts">
import { ref } from 'vue'
import { MEDIA_STATUS, MEDIA_TYPE } from '@/ts/constants/filters';
import { createMedia, createMediaTagLink } from '@/ts/api/media';
import type { MediaRequest } from '@/types/media';
import { createField } from '@/ts/api/fields';
import { createMediaField } from '@/ts/api/MediaFields';
import { createTag } from '@/ts/api/tags';
import router from '@/ts/router';

/* ---------------- Const -----------------------*/
const name = ref('')
const media_type = ref('')
const img_url = ref('')
const rating = ref<number | null>(null)
const status = ref('')
const genre = ref('')
const start_date = ref('')
const completion_date = ref('')
const description = ref('')
const notes = ref('')

/* ---------------- Tags -----------------------*/
const newTag = ref('')
const newTagColor = ref('#d8b34a')
const tags = ref<{ name: string; color: string }[]>([])

const addTag = () => {
    const t = newTag.value.trim()
    if (t && !tags.value.find(tag => tag.name === t)) {
        tags.value.push({ name: t, color: newTagColor.value })
    }
    newTag.value = ''
    newTagColor.value = '#d8b34a'
}

const removeTag = (name: string) => {
    tags.value = tags.value.filter(t => t.name !== name)
}

/* ---------------- Custom Fields -----------------------*/
const customFields = ref<{ name: string; value: string }[]>([])
const tmpFieldName = ref('')
const tmpFieldValue = ref('')

const addCustomField = () => {
    const n = tmpFieldName.value.trim()
    const v = tmpFieldValue.value.trim()
    if (!n) return
    customFields.value.push({ name: n, value: v })
    tmpFieldName.value = ''
    tmpFieldValue.value = ''
}

const removeCustomField = (index: number) => {
    customFields.value.splice(index, 1)
}

/* ---------------- Erreurs -----------------------*/
const errorMessage = ref('')
const showError = ref(false)

const displayError = (msg: string) => {
    errorMessage.value = msg
    showError.value = true
    setTimeout(() => showError.value = false, 4000)
}

/* ---------------- Validation -----------------------*/
const validate = (): boolean => {
    if (!name.value.trim()) { displayError('Title is required.'); return false }
    if (!media_type.value) { displayError('Media type is required.'); return false }
    if (!status.value) { displayError('Status is required.'); return false }
    return true
}


/* ---------------- Submit -----------------------*/
const handleSubmit = async () => {
    if (!validate()) return
    try {
        const mediaPayload: MediaRequest = {
            completion_date: completion_date.value ? `${completion_date.value}T00:00:00Z` : null,
            description: description.value,
            genre: genre.value,
            img_url: img_url.value,
            media_type: media_type.value,
            name: name.value,
            notes: notes.value,
            rating: rating.value,
            start_date: start_date.value ? `${start_date.value}T00:00:00Z` : null,
            status: status.value,
        }
        const createdMedia = await createMedia(mediaPayload)

        for (const field of customFields.value) {
            const createdField = await createField({ name: field.name })

            await createMediaField({
                field_id: createdField.field_id,
                media_id: createdMedia.media_id,
                value: field.value,
            })
        }

        for (const tag of tags.value) {
            const newTag = await createTag({
                name: tag.name,
                color: tag.color,
            });
            await createMediaTagLink(createdMedia.media_id, newTag.tag_id);
        }
        router.push(`/media/${createdMedia.media_id}`)
    } catch (e: any) {
        const msg = e?.response?.data?.message ?? e?.message ?? 'An error pop\'s out, that may be our bad.'
        displayError(`Error : ${msg}`)
    }
}
</script>

<template>
    <div class="media-card">
        <Transition name="popup">
            <div v-if="showError" class="error-popup">
                ⚠️ {{ errorMessage }}
            </div>
        </Transition>

        <!-- RECTO -->
        <div class="card-recto">
            <div class="recto-header">
                <input class="input-title" v-model="name" placeholder="Media Title *" />
                <select class="input-badge" v-model="media_type">
                    <option value="" disabled>Type... *</option>
                    <option v-for="type in MEDIA_TYPE" :key="type" :value="type">{{ type }}</option>
                </select>
            </div>

            <div class="image-wrapper">
                <img
                    v-if="img_url"
                    class="media-image"
                    :src="img_url"
                    :alt="name"
                />
                <div v-else class="image-placeholder">
                    🖼️ Image preview
                </div>
                <input class="input-url" v-model="img_url" placeholder="Image URL" />
            </div>

            <div class="recto-footer">
                <div class="footer-tags-wrapper">
                    <strong>Tags</strong>
                    <div class="footer-tags">
                        <span
                            v-for="tag in tags"
                            :key="tag.name"
                            class="tag-removable"
                            :style="{ backgroundColor: tag.color + '33' }"
                            @click="removeTag(tag.name)"
                            title="Click to delete"
                        >
                            <span class="tag-dot" :style="{ backgroundColor: tag.color }"></span>
                            {{ tag.name }} ✕
                        </span>
                    </div>
                    <div class="tag-input-row">
                        <input v-model="newTag" placeholder="Add a tag..." @keyup.enter="addTag" />
                        <input type="color" v-model="newTagColor" class="color-picker" title="Tag color" />
                        <button @click="addTag">+</button>
                    </div>
                </div>

                <div class="footer-infos">
                    <div class="input-info-row">
                        <span class="info-label">Rating ⭐</span>
                        <input type="number" v-model="rating" min="0" max="5" placeholder="-" />
                    </div>
                    <div class="input-info-row">
                        <span class="info-label">Status *</span>
                        <select v-model="status">
                            <option value="" disabled>-</option>
                            <option v-for="s in MEDIA_STATUS" :key="s" :value="s">{{ s }}</option>
                        </select>
                    </div>
                    <div class="input-info-row">
                        <span class="info-label">Genre</span>
                        <input v-model="genre" placeholder="-" />
                    </div>
                </div>
            </div>
        </div>

        <!-- VERSO -->
        <div class="card-verso">
            <div class="dates">
                <div class="date-field">
                    <strong>Start :</strong>
                    <input type="date" v-model="start_date" />
                </div>
                <div class="date-field">
                    <strong>End :</strong>
                    <input type="date" v-model="completion_date" />
                </div>
            </div>

            <span>Description</span>
            <textarea class="description" v-model="description" placeholder="Description..." />

            <span>Notes</span>
            <textarea class="notes" v-model="notes" placeholder="Notes personnelles..." />

            <div class="custom-fields-section">
                <strong>Personalized fields</strong>

                <div class="custom-field-row" v-for="(field, index) in customFields" :key="index">
                    <span class="field-name">{{ field.name }} :</span>
                    <input v-model="field.value" :placeholder="field.name" />
                    <button class="btn-remove" @click="removeCustomField(index)">✕</button>
                </div>

                <div class="custom-field-add">
                    <input v-model="tmpFieldName" placeholder="Field name..." />
                    <input v-model="tmpFieldValue" placeholder="Value..." />
                    <button @click="addCustomField">+</button>
                </div>
            </div>

            <button class="btn-submit" @click="handleSubmit">Create Media</button>
        </div>

    </div>
</template>

<style scoped>
.media-card {
    width: 95%;
    height: 90%;
    box-sizing: border-box;
    min-height: 0;
    display: flex;
    gap: 2rem;
    overflow: hidden;
    border-radius: 1.5rem;
    padding: 2rem;
    background: linear-gradient(145deg, rgba(255,255,255,.08), rgba(255,255,255,.02));
    border: .25rem solid #d8b34a;
    box-shadow: 0 1.5rem 3rem var(--shadow), inset 0 0 1rem rgba(255,255,255,.08);
}

/********************************************/

.card-recto {
    flex: 0 0 32%;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.5rem;
    border-radius: 1.25rem;
    background: var(--bg-label);
    border: .15rem solid var(--color-border);
}

/********************************************/

.recto-header {
    text-align: center;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5rem;
}

.input-title {
    width: 100%;
    font-size: clamp(1.2rem, 1.8vw, 2rem);
    font-weight: bold;
    color: var(--color-primary);
    background: transparent;
    border: none;
    border-bottom: .15rem solid var(--color-primary);
    text-align: center;
    outline: none;
    padding: .25rem 0;
}

.input-badge {
    margin-top: .5rem;
    padding: .45rem 1rem;
    border-radius: 999rem;
    background: var(--color-primary);
    color: white;
    border: none;
    font-size: clamp(.8rem, .9vw, 1rem);
    text-align: center;
    outline: none;
    width: auto;
}

.input-badge::placeholder { color: rgba(255,255,255,.7); }

/********************************************/

.image-wrapper {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    flex: 0 0 auto;
}

.media-image {
    width: 100%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: 1rem;
    border: .2rem solid #d8b34a;
    box-shadow: 0 .75rem 1.5rem rgba(0,0,0,.25);
}

.image-placeholder {
    width: 100%;
    aspect-ratio: 3 / 2;
    border-radius: 1rem;
    border: .2rem dashed #d8b34a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary);
    font-size: 1.2rem;
    opacity: .5;
}

.input-url {
    width: 100%;
    box-sizing: border-box;
    padding: .35rem .75rem;
    border-radius: .5rem;
    border: .1rem solid var(--color-border);
    background: transparent;
    font-size: clamp(.7rem, .8vw, .9rem);
    color: var(--color-primary);
    outline: none;
}

/********************************************/

.recto-footer {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin-top: .75rem;
}

.footer-tags-wrapper {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    flex: 1;
}

.footer-tags {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-height: calc(3 * 2.2rem + 2 * .5rem);
    gap: .5rem;
}

.tag-dot {
    display: inline-block;
    width: .55rem;
    height: .55rem;
    border-radius: 50%;
    flex-shrink: 0;
}

.footer-tags span {
    display: flex;
    align-items: center;
    gap: .4rem;
}

.color-picker {
    width: 2rem;
    height: 2rem;
    padding: .1rem;
    border-radius: 50%;
    border: .1rem solid #d8b34a;
    background: transparent;
    cursor: pointer;
    flex-shrink: 0;
}

.color-picker::-webkit-color-swatch-wrapper { padding: 0; }
.color-picker::-webkit-color-swatch { border-radius: 50%; border: none; }

.tag-removable {
    cursor: pointer;
    transition: opacity .2s;
    border-radius: 20px;
}

.tag-removable:hover { opacity: .6; }

.tag-input-row {
    display: flex;
    gap: .35rem;
}

.tag-input-row input {
    flex: 1;
    padding: .3rem .6rem;
    border-radius: 999rem;
    border: .1rem solid #d8b34a;
    background: transparent;
    font-size: clamp(.7rem, .8vw, .9rem);
    color: var(--color-primary);
    outline: none;
}

.tag-input-row button {
    padding: .3rem .7rem;
    border-radius: 999rem;
    border: none;
    background: var(--color-primary);
    color: white;
    cursor: pointer;
    font-size: 1rem;
}

/********************************************/

.footer-infos {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    flex: 1;
}

.input-info-row {
    display: flex;
    flex-direction: column;
    gap: .2rem;
}

.info-label {
    font-size: clamp(.7rem, .75vw, .85rem);
    color: var(--color-primary);
    font-weight: bold;
}

.input-info-row input {
    padding: .35rem .75rem;
    border-radius: .5rem;
    border: .1rem solid var(--color-border);
    background: transparent;
    font-size: clamp(.75rem, .85vw, .95rem);
    color: inherit;
    outline: none;
    width: 100%;
    box-sizing: border-box;
}

select {
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right .75rem center;
    padding-right: 2rem;
}

.input-badge {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right .75rem center;
    padding-right: 2rem;
}

.input-info-row select {
    padding: .35rem .75rem;
    border-radius: .5rem;
    border: .1rem solid var(--color-border);
    background-color: rgb(202, 202, 202);
    color: inherit;
    outline: none;
    font-size: clamp(.75rem, .85vw, .95rem);
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
}
/********************************************/

.card-verso {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    border-radius: 1.25rem;
    background: var(--bg-label);
    border: .15rem solid var(--color-border);
}

/********************************************/

.dates {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    font-size: clamp(.9rem, 1vw, 1.1rem);
}

.date-field {
    display: flex;
    align-items: center;
    gap: .5rem;
}

.date-field input {
    padding: .3rem .6rem;
    border-radius: .5rem;
    border: .1rem solid var(--color-border);
    background: transparent;
    color: inherit;
    outline: none;
    font-size: clamp(.85rem, .95vw, 1rem);
}

/********************************************/

.description {
    flex: 1;
    min-height: 0;
    resize: none;
    padding: 1.5rem;
    border-radius: 1rem;
    background: rgba(0,0,0,.05);
    border: none;
    line-height: 1.8;
    font-size: clamp(.95rem, 1vw, 1.15rem);
    color: inherit;
    outline: none;
    font-family: inherit;
}

/********************************************/

.notes {
    flex-shrink: 0;
    min-height: 4rem;
    resize: none;
    padding: 1.5rem;
    border-radius: 1rem;
    border: none;
    border-left: .35rem solid var(--color-primary);
    background: rgba(0,0,0,.05);
    font-style: italic;
    font-size: clamp(.9rem, .95vw, 1.05rem);
    color: inherit;
    outline: none;
    font-family: inherit;
}

.custom-fields-section {
    display: flex;
    flex-direction: column;
    gap: .6rem;
}

.custom-field-row {
    display: flex;
    align-items: center;
    gap: .75rem;
    font-size: clamp(.9rem, 1vw, 1.1rem);
}

.field-name {
    font-weight: bold;
    white-space: nowrap;
    min-width: 6rem;
}

.custom-field-row input {
    flex: 1;
    padding: .35rem .75rem;
    border-radius: .5rem;
    border: .1rem solid var(--color-border);
    background: transparent;
    color: inherit;
    outline: none;
    font-size: clamp(.85rem, .95vw, 1rem);
}

.btn-remove {
    padding: .3rem .6rem;
    border-radius: 999rem;
    border: .1rem solid #d8b34a;
    background: transparent;
    color: var(--color-primary);
    cursor: pointer;
    font-size: .85rem;
    transition: opacity .2s;
}
.btn-remove:hover { opacity: .6; }

.custom-field-add {
    display: flex;
    gap: .5rem;
    margin-top: .25rem;
}

.custom-field-add input {
    flex: 1;
    padding: .35rem .75rem;
    border-radius: .5rem;
    border: .1rem solid #d8b34a;
    background: transparent;
    color: inherit;
    outline: none;
    font-size: clamp(.8rem, .9vw, 1rem);
}

.custom-field-add button {
    padding: .35rem .85rem;
    border-radius: 999rem;
    border: none;
    background: var(--color-primary);
    color: white;
    cursor: pointer;
    font-size: 1rem;
    transition: opacity .2s;
}
.custom-field-add button:hover { opacity: .8; }

/********************************************/

.btn-submit {
    margin-top: auto;
    padding: .75rem 2rem;
    border-radius: 999rem;
    border: none;
    background: var(--color-primary);
    color: white;
    font-size: clamp(.9rem, 1vw, 1.1rem);
    cursor: pointer;
    align-self: flex-end;
    transition: opacity .2s;
}

.btn-submit:hover { opacity: .8; }

/* Popup */
.error-popup {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;

    padding: .85rem 1.75rem;
    border-radius: 999rem;

    background: #c0392b;
    color: white;

    font-size: clamp(.85rem, 1vw, 1rem);
    font-weight: 500;

    box-shadow: 0 .5rem 2rem rgba(0,0,0,.3);
    white-space: nowrap;
}

.popup-enter-active,
.popup-leave-active {
    transition: opacity .3s, transform .3s;
}
.popup-enter-from,
.popup-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(1rem);
}

/* Champs en erreur */
.input-error {
    border-color: #c0392b !important;
}

.badge-error {
    background: #c0392b !important;
}

/********************************************/

@media (max-width: 62rem) {
    .media-card {
        flex-direction: column;
        min-height: auto;
    }
    .card-recto,
    .card-verso {
        flex: none;
        width: 100%;
    }
    .media-image,
    .image-placeholder {
        aspect-ratio: unset;
        max-height: 20rem;
    }
}
</style>