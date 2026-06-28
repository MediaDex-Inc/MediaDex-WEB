import {request} from './helper'
import type { Field, FieldRequest } from '@/types/field'

/**
 * Call media api endpoint to get all fields of the user.
 * 
 * @returns All the fields for the user.
 * @throws Error When there is an API issue
 */
export async function getFields(): Promise<Field[]> {
    return request('/fields')
}

export async function createField(
    payload: FieldRequest
) : Promise<Field> {
    const data = await request<Field>('/fields', {
        method: "POST",
        body: JSON.stringify({
            ...payload
        })
    });
    return data
}

export async function deleteField(
    fieldId: number
) : Promise<Field> {
    const data = await request<Field>(`/fields/${fieldId}`, {
        method: "DELETE"
    });
    return data
}