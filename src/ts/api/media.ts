import {request} from './helper'
import type { Media } from '@/types/media'

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