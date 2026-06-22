export const FILTER_OPERATORS = [
  'eq',
  'ne',
  'lt',
  'le',
  'gt',
  'ge',
  'contains'
] as const

export const AVAILABLE_FILTERS = [
  'Status',
  'Genre',
  'Rating',
  'Name',
  'MediaType',
  'StartDate',
  'completionDate'
] as const