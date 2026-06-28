import type { Tag } from '@/types/tags'
import {request} from './helper'
import type { Media, MediaRequest } from '@/types/media'
import type { Field } from '@/types/field'

/**
 * Call media api endpoint to get all media of the user.
 * 
 * @returns All the media for the user.
 * @throws Error When there is an API issue
 */
export async function getMedia(): Promise<Media[]> {
    return request('/media')
}

export async function getMediaById(
    mediaId: number
): Promise<Media> {
    return request(`/media/${mediaId}`)
}

export async function getMediaTags(
    mediaId: number
): Promise<Tag[]> {
    return request(`/media/${mediaId}/tags`)
}

export async function getMediaCustomFields(
    mediaId: number
): Promise<Field[]> {
    return request(`/media/${mediaId}/fields`)
}

export async function createMedia(
    payload: MediaRequest
) : Promise<Media> {
    const data = await request<Media>('/media', {
        method: "POST",
        body: JSON.stringify({
            ...payload
        })
    });
    return data
}

export async function createMediaTagLink(
    mediaId: number,
    tagId: number
) : Promise<Media> {
    const data = await request<Media>(`/media/${mediaId}/tags/${tagId}`, {
        method: "POST"
    });
    return data
}

export async function updateMedia(
    mediaId: number,
    payload: MediaRequest
) : Promise<Media> {
    const data = await request<Media>(`/media/${mediaId}`, {
        method: "PATCH",
        body: JSON.stringify({
            ...payload
        })
    });
    return data
}

export async function removeMediaTagLink(
    mediaId: number,
    tagId: number
) : Promise<Media> {
    const data = await request<Media>(`/media/${mediaId}/tags/${tagId}`, {
        method: "DELETE"
    });
    return data
}