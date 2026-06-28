import { normalizeFilters } from '../utils/filters'
import {request} from './helper'
import type { Collection, CollectionApi } from '@/types/collection'

/**
 * Call collections api endpoint to get all collection of the user.
 * 
 * @returns All the collection for the user.
 * @throws Error When there is an API issue
 */
export async function getCollections(): Promise<Collection[]> {
    const data = await request<CollectionApi[]>('/collections')

    return data.map(c => ({
        userId: c.user_id,
        name: c.name,
        filters: normalizeFilters(c.filters)
    }))
}

export async function getCollectionById(
  collectionId: number
): Promise<Collection> {
    const data = await request<CollectionApi>(`/collections/${collectionId}`)

    return {
        userId: data.user_id,
        name: data.name,
        filters: normalizeFilters(data.filters)
    }
}

export async function setCollection(
    filters: string,
    name: string
) : Promise<CollectionApi> {
    const data = await request<CollectionApi>('/collections', {
        method: "POST",
        body: JSON.stringify({
            filters,
            name
        })
    });
    return data
}