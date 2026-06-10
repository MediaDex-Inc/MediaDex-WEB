import {request} from './helper'
import type { Collection } from '@/types/collection'

/**
 * Call collections api endpoint to get all collection of the user.
 * 
 * @returns All the collection for the user.
 * @throws Error When there is an API issue
 */
export async function getCollection(): Promise<Collection[]> {
    return request('/collections')
}

export async function getCollectionById(
    collectionId: number
): Promise<Collection> {
    return request(`/collections/${collectionId}`)
}