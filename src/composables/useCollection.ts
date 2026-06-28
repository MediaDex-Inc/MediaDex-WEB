import { ref } from 'vue'
import { getCollections, setCollection } from '@/ts/api/collections'
import { FILTER_KEY_MAP } from '@/ts/constants/filters'
import type { CollectionFilter } from '@/types/filters'
import type { Collection } from '@/types/collection'
import type { Ref } from 'vue'

export function useCollections(editableFilters: Ref<CollectionFilter[]>) {
    const collections = ref<Collection[]>([]);
    const showNameModal = ref(false);

    const getAllCollections = async () => {
        try {
            collections.value = await getCollections();
        } catch (e) {
            console.log(e);
        }
    }

  const saveFilters = () => {
        const validFilters = editableFilters.value.filter(
            f => f.Key && f.ops && f.Value
        )
        if (!validFilters.length) return;
        showNameModal.value = true;
  }

  const confirmSave = async (name: string) => {
        if (!name.trim()) return;

        const validFilters = editableFilters.value.filter(
            f => f.Key && f.ops && f.Value
        )

        const mappedFilters = validFilters.map(f => ({
            Key:   FILTER_KEY_MAP[f.Key] ?? f.Key,
            ops:   f.ops,
            Value: f.Value
        }));

        const filtersString = mappedFilters.length === 1
            ? JSON.stringify(mappedFilters[0])
            : JSON.stringify(mappedFilters);

        await setCollection(filtersString, name.trim());
        await getAllCollections();

        showNameModal.value = false;
  }

    return {
        collections,
        showNameModal,
        getAllCollections,
        saveFilters,
        confirmSave,
    }
}