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

export const FILTER_KEY_MAP: Record<string, string> = {
  Status:         'status',
  Genre:          'genre',
  Rating:         'rating',
  Name:           'name',
  MediaType:      'media_type',
  StartDate:      'start_date',
  completionDate: 'completion_date',
};

// Invert the mapping
export const FILTER_KEY_MAP_REVERSE = Object.fromEntries(
  Object.entries(FILTER_KEY_MAP).map(([k, v]) => [v, k])
);


export const MEDIA_STATUS = [
    "Planned",
    "In Progress",
    "Paused",
    "Completed",
    "Abandoned",
    "For Later"
]

export const MEDIA_TYPE = [
    "Film",
    "Shows",
    "Games",
    "Books"
]