import xml2js from 'xml2js'
import { Podcast, PodcastEpisode } from '../utils/helper'

// Update the directus_image field of a podcast in the database.
const updatePodcastImage = async (
  podcastService: any,
  keys: string,
  imageId: string
): Promise<string> => {
  return await podcastService.updateOne(keys, {
    podcasts_image: imageId
  })
}

// Retrieve episodes of a podcast from the database.
const getPodcastEpisodes = async (
  podcastId: string,
  podcastEpisodesService: any
): Promise<{ id: string }> => {
  return await podcastEpisodesService.readByQuery({
    fields: ['id'],
    filter: {
      podcast_id: podcastId
    },
    limit: -1
  })
}

//  Delete podcast episodes from the database.
const deletePodcastEpisodes = async (
  toDelete: string[],
  podcastEpisodesService: any
): Promise<void> => {
  return await podcastEpisodesService.deleteByQuery({
    filter: {
      id: {
        _in: toDelete
      }
    },
    limit: -1
  })
}

//Create podcast episodes in the database.
const createPodcastEpisodes = async (
  episodesToCreate: PodcastEpisode[],
  podcastEpisodesService: any
): Promise<string[]> => {
  return await podcastEpisodesService.createMany(episodesToCreate)
}

// Update a podcast in the database.
const updatePodcast = async (
  podcastId: string,
  podcast: Podcast,
  podcastService: any
): Promise<string> => {
  return await podcastService.updateOne(podcastId, podcast)
}

// Retrieve all podcasts from the database.
const getPodcasts = async (podcastService: any): Promise<Podcast[]> => {
  return await podcastService.readByQuery({
    fields: ['id', 'rss_feed', 'podcasts_image'],
    limit: -1
  })
}

const getParsedImageDetails = async (data: string) => {
  let episodes, channel
  // Parsing XML to JavaScript object
  xml2js.parseString(data, (err, result) => {
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
