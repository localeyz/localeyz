/**
 * Update the directus_image field of a podcast in the database.
 * @param {any} database - The database connection.
 * @param {string} keys - The primary key(s) of the podcast to update.
 * @param {any} res - The response object containing the updated image ID.
 * @returns {Promise<any>} - A promise that resolves once the podcast image is updated.
 */
const updatePodcastImage = async (
  database: any,
  keys: string,
  res: any
): Promise<any> => {
  return await database('podcasts')
    .where('id', keys)
    .update({ directus_image: res.data.data.id })
}

/**
 * Retrieve episodes of a podcast from the database.
 * @param {string} podcastId - The ID of the podcast.
 * @param {any} database - The database connection.
 * @returns {Promise<any>} - A promise that resolves to the episodes of the specified podcast.
 */
const getPodcastEpisodes = async (
  podcastId: string,
  database: any
): Promise<any> => {
  return await database('podcast_episodes')
    .where('podcast_id', podcastId)
    .select('id')
}

/**
 * Delete podcast episodes from the database.
 * @param {any} toDelete - Array of episode IDs to delete.
 * @param {any} database - The database connection.
 * @returns {Promise<any>} - A promise that resolves once the episodes are deleted.
 */
const deletePodcastEpisodes = async (toDelete: any, database: any) => {
  return await database('podcast_episodes').whereIn('id', toDelete).del()
}

/**
 * Create podcast episodes in the database.
 * @param {any} episodesToCreate - Array of episodes to create.
 * @param {any} database - The database connection.
 * @returns {Promise<any>} - A promise that resolves once the episodes are created.
 */
const createPodcastEpisodes = async (
  episodesToCreate: any,
  database: any
): Promise<any> => {
  return await database('podcast_episodes').insert(episodesToCreate)
}

/**
 * Update a podcast in the database.
 * @param {string} podcastId - The ID of the podcast to update.
 * @param {any} podcast - The updated podcast object.
 * @param {any} database - The database connection.
 * @returns {Promise<any>} - A promise that resolves once the podcast is updated.
 */
const updatePodcast = async (
  podcastId: string,
  podcast: any,
  database: any
): Promise<any> => {
  return await database('podcasts').where('id', podcastId).update(podcast)
}

/**
 * Retrieve all podcasts from the database.
 * @param {any} database - The database connection.
 * @returns {Promise<any>} - A promise that resolves to all podcasts in the database.
 */
const getPodcasts = async (database: any): Promise<any> => {
  return await database('podcasts').select('id', 'rss_feed', 'directus_image')
}

export {
  updatePodcastImage,
  getPodcastEpisodes,
  deletePodcastEpisodes,
  createPodcastEpisodes,
  updatePodcast,
  getPodcasts
}
