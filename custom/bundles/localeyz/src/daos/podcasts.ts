import xml2js from 'xml2js'

/**
 * Update the directus_image field of a podcast in the database.
 * @param {any} podcastService - The database connection.
 * @param {string} keys - The primary key(s) of the podcast to update.
 * @param {any} res - The response object containing the updated image ID.
 * @returns {Promise<any>} - A promise that resolves once the podcast image is updated.
 */
/** */
const updatePodcastImage = async (
  podcastService: any,
  keys: string,
  res: any
): Promise<any> => {
  return await podcastService.updateOne(keys, {
    directus_image: res.data.data.id
  })
}

/**
 * Retrieve episodes of a podcast from the database.
 * @param {string} podcastId - The ID of the podcast.
 * @param {any} podcastEpisodesService - The database connection.
 * @returns {Promise<any>} - A promise that resolves to the episodes of the specified podcast.
 */
const getPodcastEpisodes = async (
  podcastId: string,
  podcastEpisodesService: any
): Promise<any> => {
  return await podcastEpisodesService.readByQuery({
    fields: ['id'],
    filter: {
      podcast_id: podcastId
    },
    limit: -1
  })
}

/**
 * Delete podcast episodes from the database.
 * @param {any} toDelete - Array of episode IDs to delete.
 * @param {any} podcastEpisodesService - The database connection.
 * @returns {Promise<any>} - A promise that resolves once the episodes are deleted.
 */
/** */
const deletePodcastEpisodes = async (
  toDelete: any,
  podcastEpisodesService: any
): Promise<any> => {
  return await podcastEpisodesService.deleteByQuery({
    filter: {
      id: {
        _in: toDelete
      }
    },
    limit: -1
  })
}

/**
 * Create podcast episodes in the database.
 * @param {any} episodesToCreate - Array of episodes to create.
 * @param {any} podcastEpisodesService - The database connection.
 * @returns {Promise<any>} - A promise that resolves once the episodes are created.
 */
/** */
const createPodcastEpisodes = async (
  episodesToCreate: any,
  podcastEpisodesService: any
): Promise<any> => {
  return await podcastEpisodesService.createMany(episodesToCreate)
  // return await database('podcast_episodes').insert(episodesToCreate)
}

/**
 * Update a podcast in the database.
 * @param {string} podcastId - The ID of the podcast to update.
 * @param {any} podcast - The updated podcast object.
 * @param {any} podcastService - The database connection.
 * @returns {Promise<any>} - A promise that resolves once the podcast is updated.
 */
const updatePodcast = async (
  podcastId: string,
  podcast: any,
  podcastService: any
): Promise<any> => {
  return await podcastService.updateOne(podcastId, podcast)
}

/**
 * Retrieve all podcasts from the database.
 * @param {any} podcastService - The database connection.
 * @returns {Promise<any>} - A promise that resolves to all podcasts in the database.
 */
const getPodcasts = async (podcastService: any): Promise<any> => {
  return await podcastService.readByQuery({
    fields: ['id', 'rss_feed', 'directus_image'],
    limit: -1
  })
}

const getParsedImageDetails = async (data: string) => {
  let episodes, channel
  // Parsing XML to JavaScript object
  xml2js.parseString(data, (err: any, result: any) => {
    if (err) {
      console.error(err)
    } else {
      channel = result.rss.channel[0]
      episodes = channel.item
    }
  })
  return { episodes, channel }
}

export {
  updatePodcastImage,
  getPodcastEpisodes,
  deletePodcastEpisodes,
  createPodcastEpisodes,
  updatePodcast,
  getPodcasts,
  getParsedImageDetails
}
