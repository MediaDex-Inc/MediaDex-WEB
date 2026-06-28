import { useMediaStore } from "@/stores/media";
import { FILTER_KEY_MAP } from "@/ts/constants/filters";
import type { CollectionFilter } from "@/types/filters";
import { computed, ref } from "vue";
import type { Media } from '@/types/media'

export function useFilters() {
    const store = useMediaStore();
    const search = ref('');
    const editableFilters = ref<CollectionFilter[]>([{ Key: '', ops: '', Value: '' }]);

    const normalizeKey = (key: string): keyof Media => {
        return (FILTER_KEY_MAP[key] ?? key.toLowerCase()) as keyof Media;
    }

    const toNumber = (v: any) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    }

    const compare = (field: any, op: string, value: string) => {

        if (field == null || value == null) return false;

        switch (op) {
            case 'eq':
                return String(field).toLowerCase() === value.toLowerCase();

            case 'ne':
                return String(field).toLowerCase() !== value.toLowerCase();

            case 'contains':
                return (String(field).toLowerCase()).includes(value.toLowerCase());

            case 'gt': {
                const a = toNumber(field);
                const b = toNumber(value);
                return a !== null && b !== null && a > b;
            }

            case 'lt': {
                const a = toNumber(field);
                const b = toNumber(value);
                return a !== null && b !== null && a < b;
            }

            case 'ge': {
                const a = toNumber(field);
                const b = toNumber(value);
                return a !== null && b !== null && a >= b;
            }

            case 'le': {
                const a = toNumber(field);
                const b = toNumber(value);
                return a !== null && b !== null && a <= b;
            }

            default:
                return false;
        }
    }

    const filteredMedia = computed(() => {
        const filters = editableFilters.value.filter(f => f.Key && f.ops && f.Value);

        return store.media
            .filter(item =>
            filters.every(f => {
                const field = item[normalizeKey(f.Key)];
                return compare(field, f.ops, f.Value);
            })
        )
        .filter(item => {
        if (!search.value.trim()) return true;

        return item.name
            ?.toLowerCase()
            .includes(search.value.toLowerCase());
        })
    })
    return {
        search,
        editableFilters,
        filteredMedia,
    }
}