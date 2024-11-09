export const TABLES = {
    PROFILES: 'profiles',
    PROJECTS: 'projects',
    TASKS: 'tasks',
    DOCUMENTS: 'documents',
    PHOTO_ANALYSES: 'photo_analyses',
    PROJECT_TIMELINES: 'project_timelines',
    PROJECT_INSIGHTS: 'project_insights',
    CONVERSATIONS: 'conversations',
    RESOURCE_ESTIMATES: 'resource_estimates',
    MATERIAL_USAGE: 'material_usage',
  } as const;
  
  export type TableName = typeof TABLES[keyof typeof TABLES];