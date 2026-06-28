export interface Media {
    completion_date: string
    description: string
    genre: string
    img_url: string
    media_id: number
    media_type: string
    name: string
    notes: string
    rating: number
    start_date: string
    status: string
    user_id: number
}

export interface MediaRequest {
    completion_date: string | null
    description: string | null
    genre: string | null
    img_url: string | null
    media_type: string
    name: string
    notes: string | null
    rating: number | null
    start_date: string | null
    status: string
}