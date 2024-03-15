type Schedule = (
  cronTab: string,
  callback: (keys: string[], req: Request, res: Response) => Promise<any>
) => void

type Action = (
  eventName: string,
  callback: (keys: Object, req: Request, res: Response) => Promise<void>
) => void

interface ItemsService {
  new (collection: string, options: any): any
  // Define other methods or properties if known
}

interface ControllerOptions {
  services: {
    ItemsService: ItemsService
  }
  database?: Object
  getSchema: () => Promise<any>
}

interface Cron {
  action: Action
  schedule: Schedule
}

interface Accountability {
  userAgent?: any
  user: string | undefined
  role?: string // Allow undefined for role
  admin: boolean
  app: boolean
  ip: string
}

interface Episode {
  description: any
  enclosure: any
  pubDate: any
  id: number
  title?: string
  program_id?: number
  organization_id?: bigint
  sponsored?: boolean
  episode_number?: string
  date_of_production?: Date
  short_description?: string
  full_description?: string
  video_url?: string
  thumbnail_url?: string
  document_url?: string
  status: string
  custom_field_value?: Record<string, any>
  published?: boolean
  created_at: Date
  updated_at: Date
  episode_origin_option_id?: bigint
  duration?: number
  telvue_file_name?: string
  telvue_episode_code?: string
  telvue_id?: string
  cablecast_program_pelantion_media?: string
  cablecast_id?: string
  telvue_delete_at?: Date
  telvue_ingest_date_time?: Date
  notes_to_producer?: string
  stream_url?: string
  telvue_connect_id?: number
  age_rating?: number
  link_expiry?: Date
  thumbnail?: string
  webflowId?: string
  episodeSlug?: string
  webflowSync?: boolean
  producer_id?: string
  time?: string
}

interface PodcastEpisode {
  id: number
  title?: string
  image?: string
  audio_uri?: string
  description?: string
  created_at: Date
  updated_at: Date
  podcast_id?: number
  published_at?: string
  podcast_episodes_image?: string // Assuming this is a foreign key referencing a file ID
}

interface Podcast {
  id?: number
  title?: string
  description?: string
  image?: string
  rss_feed?: string
  created_at?: Date
  updated_at?: Date
  name?: string
  organization_id?: bigint
  published?: boolean
  user_id?: string
  podcasts_image?: string // Assuming this is a foreign key referencing a file ID
  skipRecursion?: boolean
}

/**
 * Interface representing a user.
 */
interface User {
  organization?: string
  linked_user?: string
  name?: string
  id?: Promise<any>
  email?: string | undefined
  role?: {
    id: string | undefined
    app_access: boolean | undefined
    admin_access: boolean | undefined
  }
}

/**
 * Interface representing a role.
 */
interface Role {
  id: string
  name: string
  app_access: boolean
  admin_access: boolean
}

interface Keys {
  collection?: string
  key?: string
  keys?: string[]
  payload?: {
    image?: string
    image_url?: string
    thumbnail_url?: string
    // Add other properties if necessary
  }
}

export type {
  ControllerOptions,
  Cron,
  Accountability,
  Episode,
  PodcastEpisode,
  Podcast,
  User,
  Role,
  Keys
}
