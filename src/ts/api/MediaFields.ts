import type { MediaField } from '@/types/mediaField';
import {request} from './helper'

/**
 * Call media api endpoint to get all fields of the user.
 * 
 * @returns All the fields for the user.
 * @throws Error When there is an API issue
 */
export async function getMediaFields(): Promise<MediaField[]> {
    return request('/fields')
}

export async function getMediaFieldValue(
    fieldId: number,
    mediaId: number
): Promise<MediaField> {
    return request(`/mediaFields/${fieldId}/${mediaId}`);
}

export async function createMediaField(
    payload: MediaField
) : Promise<MediaField> {
    const data = await request<MediaField>('/mediaFields', {
        method: "POST",
        body: JSON.stringify({
            ...payload
        })
    });
    return data
}

export async function updateMediaField(
    fieldId: number,
    mediaId: number,
    value: string
) : Promise<MediaField> {
    const data = await request<MediaField>(`/mediaFields/${fieldId}/${mediaId}`, {
        method: "PATCH",
        body: JSON.stringify({
            value
        })
    });
    return data
}

export async function deleteMediaField(
    fieldId: number,
    mediaId: number
) : Promise<MediaField> {
    const data = await request<MediaField>(`/mediaFields/${fieldId}/${mediaId}`, {
        method: "DELETE"
    });
    return data
}