import type { CollectionFilter } from "./filters"

export interface Collection {
  userId: number
  name: string
  filters: CollectionFilter[]
}

export interface CollectionApi {
  user_id: number
  name: string
  filters: string
}