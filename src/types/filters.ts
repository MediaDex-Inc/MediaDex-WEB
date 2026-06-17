export interface CollectionFilter {
  Key: FilterKey
  ops: FilterOperator
  Value: string
}

export type FilterOperator =
  | 'eq'
  | 'ne'
  | 'lt'
  | 'le'
  | 'gt'
  | 'ge'
  | 'contains'
  | ''

export type FilterKey =
  | 'Status'
  | 'Rating'
  | 'Name'
  | 'StartDate'
  | 'CompletionDate'
  | ''