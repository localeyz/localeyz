import axios from 'axios'
import jwt from 'jsonwebtoken'
import {
  createPodcastEpisodes,
  deletePodcastEpisodes,
  getParsedImageDetails,
  getPodcastEpisodes,
  getPodcasts,
  updatePodcast,
  updatePodcastImage
} from '../daos/podcasts'
import { ACCOUNTABILITY, PUBLIC_URL, SECRET } from '../utils/config'
import { Accountability, ControllerOptions, Episode } from '../utils/helper'

// Function to create JWT token
const createJwtToken = (accountability: Accountability) => {
  const { user, role, admin, app } = accountability
  const id = user

  const payload = {
    id,
    role,
    app_access: app,
    admin_access: admin,
    iat: Math.floor(Date.now() / 1000), // Issued at time in seconds
    exp: Math.floor(Date.now() / 1000) + 60, // Expiry time in seconds (1 Min)
    iss: 'directus'
  }

  return jwt.sign(payload, SECRET)
}

// Handler function to handle URL and update podcast image
const handler = async ({
  url,
  keys,
  user,
  token,
  podcastService
}: {
  url: string | null | undefined
  keys: string
  user?: string | null
  token: string
  podcastService: any
}) => {
  if (!url) {
    return
  }

  try {
    const res = await axios.post(
      `${PUBLIC_URL}/files/import`,
      {
        url,
        data: {
          uploaded_by: { id: user }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    await updatePodcastImage(podcastService, keys, res.data.data.id)
    return res.data.data.id
  } catch (error: any) {
    console.error('Error handling URL:', error, error.data)
    throw error
  }
}

// Function to run the podcast scheduler
const run = async (
  podcastId: string,
  rssFeed: string,
  context: ControllerOptions,
  req: Request
) => {
  const { getSchema, services } = context

  let accountability: Accountability
  const podcast: {
    skipRecursion?: boolean
    title: string
    image: string
    description: string
    podcasts_image: string
  } = {
    title: '',
    image: '',
    description: '',
    podcasts_image: ''
  }
  if (req) {
    accountability = req.accountability
  } else {
    accountability = ACCOUNTABILITY
    podcast.skipRecursion = true
  }

  console.log('STARTING REFRESH', podcastId)

  try {
    const { ItemsService } = services
    const schema = await getSchema()
    const serviceOptions = {
      schema: schema,
      accountability
    }

    const podcastEpisodesService = new ItemsService(
      'podcast_episodes',
      serviceOptions
    )
    const podcastService = new ItemsService('podcasts', serviceOptions)

    const parsed = await axios.get<string>(rssFeed)
    // const data = podcastFeedParser.getPodcastFromFeed(parsed.data)
    const data = (await getParsedImageDetails(parsed.data)).episodes
    const metadata = (await getParsedImageDetails(parsed.data)).channel

    // Prepare episodes to create
    const episodesToCreate = data?.map((episode: Episode) => {
      return {
        title: episode.title[0],
        published_at: episode.pubDate[0],
        audio_uri: episode.enclosure[0]?.url,
        description: episode.description[0],
        image: episode['itunes:image'][0].$.href,
        podcast_id: podcastId,
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    // Get existing podcast episodes
    const podcastEpisodes = await getPodcastEpisodes(
      podcastId,
      podcastEpisodesService
    )

    // Prepare episodes to delete
    const toDelete = podcastEpisodes.map((e: { id: string }) => e.id)

    // Delete existing podcast episodes if any
    if (toDelete.length > 0) {
      await deletePodcastEpisodes(toDelete, podcastEpisodesService)
    }

    // Create new podcast episodes
    if (episodesToCreate.length > 0) {
      await createPodcastEpisodes(episodesToCreate, podcastEpisodesService)
    }

    // Create JWT token
    const token = createJwtToken(accountability)

    // Handle podcast image
    const tempImageId = await handler({
      url: metadata['itunes:image'][0].$.href,
      keys: podcastId,
      user: accountability?.user,
      token,
      podcastService
    })

    // Update podcast details
    podcast.title = metadata?.title[0] //data?.meta?.title
    podcast.image = metadata['itunes:image'][0].$.href // data?.meta?.imageURL
    podcast.description = metadata?.description[0] //data?.meta?.description
    podcast.podcasts_image = tempImageId

    await updatePodcast(podcastId, podcast, podcastService)
  } catch (error) {
    console.error('Error during run:', error)
  }
}

// Function to schedule podcasts
const podcaseScheduler = async (req: Request, context: ControllerOptions) => {
  const { getSchema, services } = context
  const { ItemsService } = services
  const schema = await getSchema()
  const serviceOptions = {
    schema: schema,
    ACCOUNTABILITY
  }

  const podcastService = new ItemsService('podcasts', serviceOptions)
  const podcasts = await getPodcasts(podcastService)

  console.time('START PODCASTS REFRESH')
  for (let i = 0; i < podcasts.length; i++) {
    if (!podcasts[i].podcasts_image)
      await run(podcasts[i]?.id, podcasts[i]?.rss_feed, context, req)
    console.log(`Finished ${i + 1} of ${podcasts.length}`)
  }

  console.timeEnd('END PODCASTS REFRESH')
}

// Export functions
export { run, podcaseScheduler, createJwtToken }
