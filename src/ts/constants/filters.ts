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
  'Rating',
  'Name',
  'StartDate',
  'completionDate'
] as const