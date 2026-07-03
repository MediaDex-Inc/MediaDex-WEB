<script setup lang="ts">
import { getMediaTags, getMediaById, getMediaCustomFields } from '@/ts/api/media';
import { onMounted, ref } from 'vue';
import type { Media } from '@/types/media';
import type { Tag } from '@/types/tags';
import type { Field } from '@/types/field';
import type { MediaField } from '@/types/mediaField';
import { useRoute, useRouter } from 'vue-router';
import { getMediaFieldValue } from '@/ts/api/MediaFields';

const router = useRouter()
const route = useRoute()
const mediaId = Number(route.params.id)

/* ---------------- Const -----------------------*/
const media = ref<Media>()
const tags = ref<Tag[]>([])
const fields = ref<Field[]>([])
const mediaFields = ref<MediaField[]>([])

/* ---------------- Helpers -----------------------*/
const getFieldValue = (fieldId: number): string => {
    return mediaFields.value.find(mf => mf.field_id === fieldId)?.value ?? '-'
}
const formatDate = (date: string | undefined): string => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-EN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

/* ---------------- Erreurs -----------------------*/
const errorMessage = ref('')
const showError = ref(false)

const displayError = (msg: string) => {
    errorMessage.value = msg
    showError.value = true
    setTimeout(() => showError.value = false, 4000)
}

/* ------------------ onMounted --------------------- */
onMounted(async () => {
    try {
        const [fetchedMedia, fetchedTags] = await Promise.all([
            getMediaById(mediaId),
            getMediaTags(mediaId),
        ])
        media.value = fetchedMedia
        tags.value = fetchedTags

        fields.value = await getMediaCustomFields(mediaId)

        const fieldValues = await Promise.all(
            fields.value.map(field => getMediaFieldValue(field.field_id, mediaId))
        )
        mediaFields.value = fieldValues

    } catch (e: any) {
        const msg = e?.response?.data?.message ?? e?.message ?? 'An error occurs during media loading.'
        displayError(`Error : ${msg}`)
    }
})
</script>


<template>
    <div class="media-card">
        <div class="card-recto">
            <div class="recto-header">
                <h2>{{ media?.name }}</h2>
                <span>{{ media?.media_type }}</span>
            </div>

            <div class="image-wrapper">
                <img class="media-image" :src="media?.img_url" :alt="media?.name" />
            </div>
            <div class="recto-footer">
                <div class="footer-tags-wrapper">
                    <strong>Tags</strong>
                    <div class="footer-tags">
                        <span v-for="tag in tags" :key="tag.tag_id" :style="{ backgroundColor: tag.color }">{{ tag.name
                            }}</span>
                    </div>
                </div>
                <div class="footer-infos">
                    <span>Rating : {{ media?.rating ?? '-' }} ⭐</span>
                    <span>Status : {{ media?.status ?? '-' }}</span>
                    <span>Genre : {{ media?.genre ?? '-' }}</span>
                </div>
            </div>
        </div>
        <div class="card-verso">
            <div class="dates">
                <p><strong>Start :</strong> {{ formatDate(media?.start_date) }}</p>
                <p><strong>End :</strong> {{ formatDate(media?.completion_date) }}</p>
            </div>
            <span>Description</span>
            <div class="description">
                {{ media?.description }}
            </div>

            <span>Notes</span>
            <div class="notes">
                {{ media?.notes }}
            </div>
            <div class="custom-fields" v-for="field in fields" :key="field.field_id">
                <strong>{{ field.name }} : </strong>
                <span>{{ getFieldValue(field.field_id) }}</span>
            </div>
            <button class="btn-edit" @click="router.push(`/media/${mediaId}/edit`)">Edit</button>
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

    background: linear-gradient(145deg,
            rgba(255, 255, 255, .08),
            rgba(255, 255, 255, .02));

    border: .25rem solid #096c6c;

    box-shadow:
        0 1.5rem 3rem var(--shadow),
        inset 0 0 1rem rgba(255, 255, 255, .08);
}

/********************************************/

.card-recto {
    flex: 0 0 32%;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: .75rem;

    padding: 1.5rem;

    border-radius: 1.25rem;

    background: var(--bg-label);

    border: .15rem solid var(--color-border);
}

/********************************************/

.recto-header {
    text-align: center;
}

.recto-header h2 {
    margin: 0;
    font-size: clamp(1.6rem, 2vw, 2.4rem);
    color: var(--color-primary);
}

.recto-header span {
    display: inline-block;

    margin-top: .75rem;
    padding: .45rem 1rem;

    border-radius: 999rem;

    background: var(--color-primary);
    color: white;

    font-size: clamp(.8rem, .9vw, 1rem);
}

/********************************************/

.image-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
}

.media-image {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    border-radius: 1rem;
    border: .2rem solid #096c6c;
    box-shadow: 0 .75rem 1.5rem rgba(0, 0, 0, .25);
}

/*********************************/
.recto-footer {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-shrink: 0;
}

.recto-footer span {
    padding: .45rem 1rem;

    border-radius: .5rem;

    background: var(--color-primary);

    color: white;

    font-size: clamp(.75rem, .85vw, .95rem);
    align-self: flex-start;

}

.footer-tags {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-height: calc(3 * 2.2rem + 2 * .5rem);
    gap: .5rem;
}

.footer-tags span {
    padding: .35rem .85rem;
    border-radius: 999rem;
    border: .1rem solid #096c6c;
    color: black;
    font-size: clamp(.7rem, .8vw, .9rem);
    white-space: nowrap;
}

.footer-tags-wrapper {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    flex: 1;
}

.footer-infos {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    flex: 1;
}

.footer-infos span {
    padding: .45rem 1rem;
    border-radius: .5rem;
    background: var(--color-primary);
    color: white;
    font-size: clamp(.75rem, .85vw, .95rem);
}

/********************************************/

.card-verso {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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

/********************************************/

.description {
    flex: 1;
    min-height: 0;
    overflow-y: auto;

    padding: 1.5rem;

    border-radius: 1rem;

    background: rgba(0, 0, 0, .05);

    line-height: 1.8;
    font-size: clamp(.95rem, 1vw, 1.15rem);
}

/********************************************/

.notes {
    flex-shrink: 1;
    min-height: 2rem;

    padding: 1.5rem;

    border-radius: 1rem;

    border-left: .35rem solid var(--color-primary);

    background: rgba(0, 0, 0, .05);

    font-style: italic;

    font-size: clamp(.9rem, .95vw, 1.05rem);
}

.btn-edit {
    margin-top: auto;
    padding: .75rem 2rem;
    border-radius: 999rem;
    border: .15rem solid var(--color-primary);
    background: transparent;
    color: var(--color-primary);
    font-size: clamp(.9rem, 1vw, 1.1rem);
    cursor: pointer;
    align-self: flex-end;
    transition: all .2s;
}

.btn-edit:hover {
    background: var(--color-primary);
    color: white;
}

/********************************************/

@media (max-width: 80rem) {
    .media-card {
        gap: 1rem;
        padding: 1rem;
    }

    .card-recto {
        flex: 0 0 36%;
        padding: 1rem;
    }

    .card-verso {
        padding: 1rem;
        gap: 1rem;
    }
}

@media (max-width: 62rem) {

    .media-card {
        flex-direction: column;
        height: auto;
        min-height: 90%;
        overflow-y: auto;
    }

    .card-recto,
    .card-verso {
        flex: none;
        width: 100%;
        overflow: visible;
        box-sizing: border-box;
    }

    .media-image {
        max-height: 32rem;
        aspect-ratio: unset;
        object-fit: cover;
    }

}
</style>