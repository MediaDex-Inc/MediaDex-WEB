import type {
  CollectionFilter,
  FilterOperator,
  FilterKey
} from '@/types/filters'

import {
  FILTER_OPERATORS,
  AVAILABLE_FILTERS
} from '@/ts/constants/filters'

export const isValidFilter = (f: any): f is CollectionFilter => {
  return (
    f &&
    typeof f === 'object' &&
    AVAILABLE_FILTERS.includes(f.Key) &&
    FILTER_OPERATORS.includes(f.ops) &&
    typeof f.Value === 'string'
  )
}

export const normalizeFilters = (filters: string): CollectionFilter[] => {
  try {
    const parsed = JSON.parse(filters)

    const normalize = (f: any): CollectionFilter => ({
      Key: f.Key ?? f.key,
      ops: f.ops,
      Value: f.Value ?? f.value
    })

    if (Array.isArray(parsed)) {
      return parsed
        .map(normalize)
        .filter(isValidFilter)
    }

    const single = normalize(parsed)

    return isValidFilter(single) ? [single] : []
  } catch {
    return []
  }
}

export const formatOp = (op: FilterOperator) => {
  const map: Record<FilterOperator, string> = {
    eq: '=',
    ne: '≠',
    lt: '<',
    le: '≤',
    gt: '>',
    ge: '≥',
    contains: 'contains'
  }

  return map[op]
}