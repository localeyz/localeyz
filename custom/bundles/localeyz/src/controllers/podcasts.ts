import podcastFeedParser from 'podcast-feed-parser'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import {
  createPodcastEpisodes,
  deletePodcastEpisodes,
  getPodcastEpisodes,
  getPodcasts,
  updatePodcast,
  updatePodcastImage
} from '../daos/podcasts'
import { ACCOUNTABILITY, PUBLIC_URL, SECRET } from '../utils/config'

// Function to create JWT token
const createJwtToken = (accountability: any) => {
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
  database
}: {
  url: string | null | undefined
  keys: string
  user?: string | null
  token: string
  database: any
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

    await updatePodcastImage(database, keys, res)
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
  context: { database: any },
  req: any,
  res: any
) => {
  const { database } = context
  let accountability: any
  let podcast: {
    skipRecursion?: boolean
    title: string
    image: string
    description: string
    directus_image: string
  } = {
    title: '',
    image: '',
    description: '',
    directus_image: ''
  }
  if (req) {
    accountability = req.accountability
  } else {
    accountability = ACCOUNTABILITY
    podcast.skipRecursion = true
  }

  console.log('STARTING REFRESH', podcastId)

  try {
    const parsed = await axios.get<string>(rssFeed)
    const data = podcastFeedParser.getPodcastFromFeed(parsed.data)

    // Prepare episodes to create
    const episodesToCreate = data?.episodes?.map((episode: any) => ({
      title: episode.title,
      published_at: episode.pubDate,
      audio_uri: episode.enclosure?.url,
      description: episode.description,
      image: episode.imageUrl,
      podcast_id: podcastId,
      created_at: new Date(),
      updated_at: new Date()
    }))

    // Get existing podcast episodes
    const podcastEpisodes = await getPodcastEpisodes(podcastId, database)

    // Prepare episodes to delete
    const toDelete = podcastEpisodes.map((e: any) => e.id)

    // Delete existing podcast episodes if any
    if (toDelete.length > 0) {
      await deletePodcastEpisodes(toDelete, database)
    }

    // Create new podcast episodes
    if (episodesToCreate.length > 0) {
      await createPodcastEpisodes(episodesToCreate, database)
    }

    // Create JWT token
    const token = createJwtToken(accountability)

    // Handle podcast image
    const tempImageId = await handler({
      url: data?.meta?.imageURL,
      keys: podcastId,
      user: accountability?.user,
      token,
      database
    })

    // Update podcast details
    podcast.title = data?.meta?.title
    podcast.image = data?.meta?.imageURL
    podcast.description = data?.meta?.description
    podcast.directus_image = tempImageId

    await updatePodcast(podcastId, podcast, database)
  } catch (error) {
    console.error('Error during run:', error)
  }
}

// Function to schedule podcasts
const podcaseScheduler = async (req: any, res: any, context: any) => {
  const { database } = context
  const podcasts = await getPodcasts(database)

  console.time('START PODCASTS REFRESH')
  for (let i = 0; i < podcasts.length; i++) {
    if (!podcasts[i].directus_image)
      await run(
        podcasts[i]?.id,
        podcasts[i]?.rss_feed,
        {
          database
        },
        req,
        res
      )
    console.log(`Finished ${i + 1} of ${podcasts.length}`)
  }

  console.timeEnd('END PODCASTS REFRESH')
}

// Export functions
export { run, podcaseScheduler, createJwtToken }
