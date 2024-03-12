import axios from 'axios'
import jwt from 'jsonwebtoken'
import { ACCOUNTABILITY, SECRET, PUBLIC_URL } from '../utils/config'
import { fetchData, uploadImage } from '../daos/global'

// Function responsible for creating the group images
const globalImage = async (req: any, res: any, keys: any, context: any) => {
  try {
    const { getSchema, services } = context
    const { ItemsService } = services
    const schema = await getSchema()
    const accountability = req.accountability

    // Extract necessary data from keys
    const collection = keys?.collection
    const key = keys.key ? keys.key : keys?.keys[0]
    const image =
      keys?.payload?.image ||
      keys?.payload?.image_url ||
      keys?.payload?.thumbnail_url
    const collections = [
      'groups',
      'live_video_episodes',
      'live_videos',
      'organizations',
      'podcast_episodes',
      'producer_portal_widgets',
      'radios',
      'programs',
      'episodes'
    ]

    // creating JWT token to upload to image
    const token = createJwtToken(ACCOUNTABILITY)

    const service = new ItemsService(collection, { schema, ACCOUNTABILITY })

    // Check if the collection requires image synchronization and if an image is provided
    if (collections.indexOf(collection) !== -1 && image) {
      // Image handler
      const imageId = await handler({
        url: image,
        user: accountability?.user,
        token
      })
      // Upload image and update in service
      if (collection === 'episodes') {
        await uploadImage(key, imageId, 'thumbnail', service)
      } else {
        const imageFieldName = collection + `_image`
        await uploadImage(key, imageId, imageFieldName, service)
      }
    }
  } catch (error: any) {
    console.log(error.message)
  }
}

// Function responsible for running the cron job to create group image
const globalImageScheduler = async (req: any, res: any, context: any) => {
  try {
    console.log('START GLOBAL IMAGE REFRESH')
    const { getSchema, services } = context
    const { ItemsService } = services
    const schema = await getSchema()

    const collections = [
      'groups',
      'organizations',
      'podcast_episodes',
      'producer_portal_widgets',
      'radios',
      'programs',
      'episodes',
      'live_videos',
      'live_video_episodes'
    ]

    for (const collection of collections) {
      const service = new ItemsService(collection, { schema, ACCOUNTABILITY })
      await processCollection(collection, service)
    }
    console.log('END PODCASTS REFRESH')
  } catch (error: any) {
    console.error('Error handling globalImageScheduler:', error, error.data)
  }
}

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
    exp: Math.floor(Date.now() / 1000) + 5 * 60, // Expiry time in seconds (5 Min)
    iss: 'directus'
  }

  return jwt.sign(payload, SECRET)
}

// Handler function to handle URL and update podcast image
const handler = async ({
  url,
  user,
  token
}: {
  url: string | null | undefined
  user?: string | null
  token: string
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
    return res.data.data.id
  } catch (error: any) {
    console.error('Error handling URL:', error.message)
  }
}

// Processes a collection based on its type, extracting relevant image data and uploading it.
const processCollection = async (collection: any, service: any) => {
  if (collection === 'episodes') {
    // Process episodes collection by chunking thumbnail URLs and uploading thumbnails
    await chunkProcess('thumbnail_url', 'thumbnail', service)
  } else {
    // For other collections, determine the image field name based on collection type
    const imageFieldName = collection + `_image`
    // If the collection is 'producer_portal_widgets', process image URLs, otherwise process images directly
    await chunkProcess(
      collection === 'producer_portal_widgets' ? 'image_url' : 'image',
      imageFieldName,
      service
    )
  }
}

const isValidURL = (url: string) => {
  // Regular expression for URL validation
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/

  // Test the URL against the regular expression
  return urlRegex.test(url)
}

//Processes data in chunks, extracting image URLs from the specified fields and uploading images.
const chunkProcess = async (
  urlField: string,
  imageField: string,
  service: any,
  chunkSize: number = 10000
) => {
  let offset = 0
  let batch

  // Continue processing batches until there are no more records left to fetch
  do {
    batch = await fetchData(urlField, imageField, service, chunkSize, offset) // Fetch a batch of data

    // Process each item in the batch concurrently
    await Promise.all(
      batch.map(async (item: any) => {
        const url = item.thumbnail_url || item.image || item.image_url // Extract the URL from the item's fields

        // Check if the URL is valid
        if (isValidURL(url)) {
          const token = createJwtToken(ACCOUNTABILITY) // Create a JWT token for Admin accountability

          // Request image processing and get the image ID asynchronously
          const imageId = await handler({
            url,
            user: ACCOUNTABILITY?.user,
            token
          })

          // If image ID is obtained, upload it to the service
          if (imageId) {
            // Upload the image ID to the service
            await uploadImage(
              item.id,
              imageId,
              urlField === 'thumbnail_url' ? 'thumbnail' : 'directus_image',
              service
            )
          }
        }
      })
    )
    offset += chunkSize // Move to the next chunk by increasing the offset
  } while (batch.length === chunkSize) // Continue until no more records are fetched in the batch
}

export { globalImage, globalImageScheduler }
