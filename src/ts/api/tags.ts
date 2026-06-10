import {request} from './helper'
import type { Tags } from '@/types/tags'

/**
 * Call tags api endpoint to get all tags of the user.
 * 
 * @returns All the tags for the user.
 * @throws Error When there is an API issue
 */
export async function getTags(): Promise<Tags[]> {
    return request('/tags')
}

export async function getTagsById(
    tagsId: number
): Promise<Tags> {
    return request(`/tags/${tagsId}`)
}