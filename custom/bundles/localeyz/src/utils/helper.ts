// Type definition for scheduling tasks
type Schedule = (
  cronTab: string,
  callback: (
    keys?: string[],
    req?: Request | undefined,
    res?: Response | undefined
  ) => Promise<any> // Schedule callback function signature
) => void

// Type definition for triggering actions
type Action = (
  eventName: string,
  callback: (
    keys: Keys,
    req?: Request | undefined,
    res?: Response | undefined
  ) => Promise<void> // Updated action callback function signature
) => void

// Interface for the ItemsService constructor
interface ItemsService {
  deleteMany: any
  readSingleton: any
  createOne: any
  createMany: any
  deleteByQuery: any
  readByQuery: any
  updateOne: any
  new (collection: string, options: any): any
}

// Interface for the Custom extension hooks constructor
interface ControllerOptions {
  services: {
    ItemsService: ItemsService // Controller options for services
  }
  // database?: Object // Optional database object
  getSchema: () => Promise<any> // Function to get schema as a promise
}

// Interface for the CRON constructor
interface Cron {
  action: Action // Interface for action
  schedule: Schedule // Interface for schedule
}

// Interface for the  Accountability constructor
interface Accountability {
  userAgent?: any // Optional user agent
  user: string | undefined // User string or undefined
  role?: string // Role string or undefined
  admin: boolean // Admin boolean
  app: boolean // App boolean
  ip: string // IP address string
}

// Interface for the Episodes constructor
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

// Interface for the Podcast-episodes constructor
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
  podcast_episodes_image?: string
}

// Interface for the Podcasts constructor
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
  podcasts_image?: string
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
  role?: Role
  provider?: string
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

// Interface for the Keys constructor
interface Keys {
  collection?: string
  key?: string
  keys?: string[]
  payload?: {
    image?: string
    image_url?: string
    thumbnail_url?: string
    skipRecursion?: boolean
    rss_feed?: string
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
  Keys,
  ItemsService
}
