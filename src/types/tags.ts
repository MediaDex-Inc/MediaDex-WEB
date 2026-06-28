export interface Tag {
    tag_id: number
    user_id: number
    name: string
    color: string
}

export interface TagRequest{
    name: string
    color: string
}