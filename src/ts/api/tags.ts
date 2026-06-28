import type { Media } from '@/types/media'
import {request} from './helper'
import type { Tag, TagRequest } from '@/types/tags'

/**
 * Call tags api endpoint to get all tags of the user.
 * 
 * @returns All the tags for the user.
 * @throws Error When there is an API issue
 */
export async function getTags(): Promise<Tag[]> {
    return request('/tags')
}

export async function getTagsById(
    tagsId: number
): Promise<Tag> {
    return request(`/tags/${tagsId}`)
}

export async function getMediaByTagId(
    tagsId: number
): Promise<Media[]> {
    return request(`/tags/${tagsId}/media`)
}

export async function createTag(
    payload: TagRequest
) : Promise<Tag> {
    const data = await request<Tag>('/tags', {
        method: "POST",
        body: JSON.stringify({
            ...payload
        })
    });
    return data
}

export async function deleteTag(
    tagId: number
) : Promise<Tag> {
    const data = await request<Tag>(`/tags/${tagId}`, {
        method: "DELETE"
    });
    return data
}