import xml2js from 'xml2js'
import { Episode, ItemsService } from '../utils/helper'

// Function to fetch user data based on user ID
const getUserData = async (user: string, usersService: ItemsService) => {
  return await usersService.readSingleton({
    filter: {
      id: user
    }
  })
}

// Function to fetch Telvue server data based on organization ID
const getTelvueServerData = async (
  organizationId: string,
  telvueService: ItemsService
) => {
  return await telvueService.readSingleton({
    filter: {
      organization_id: organizationId
    }
  })
}

// Function to fetch episode data based on episode ID
const getEpisodeData = async (
  episode: string,
  episodesService: ItemsService
) => {
  return await episodesService.readSingleton({
    fields: ['*', 'topics.topic_id.title'],
    filter: {
      id: episode
    }
  })
}

// Function to fetch program data based on program ID
const getProgramData = async (
  programId: string,
  programsService: ItemsService
) => {
  return await programsService.readSingleton({
    filter: {
      id: programId
    }
  })
}

// Function to fetch producer data based on producer ID
const getProducerData = async (
  producerId: string,
  usersService: ItemsService
) => {
  return await usersService.readSingleton({
    filter: {
      id: producerId
    }
  })
}

// Function to update episode with Telvue ID
const updateEpisode = async (
  id: string,
  condition: object,
  episodesService: ItemsService
) => {
  return await episodesService.updateOne(id, condition)
}

// Function to create a notification
const createNotification = async (
  userId: string,
  subject: string,
  message: string,
  collection: string,
  item: string,
  notificationService: ItemsService
) => {
  return await notificationService.createOne({
    status: 'inbox',
    recipient: userId,
    sender: userId,
    subject,
    message,
    collection,
    item
  })
}

// Function to extract Telvue ID from metadata
const fetchTelvueId = async (data: string) => {
  let telvueId
  // Parsing XML to JavaScript object
  xml2js.parseString(data, (err, result) => {
    if (err) {
      console.error(err)
    } else {
      telvueId = result['content-file']['id'][0]['_'] // Extracting Telvue ID from parsed data
    }
  })
  return telvueId
}

// Function to get all telvue_data
const getTelvueData = async (telvueService: ItemsService) => {
  return await telvueService.readByQuery({
    filter: {
      has_connect: true,
      auto_sync_connect: true
    },
    limit: -1
  })
}

const getTelvueEpisodeData = async (
  organizationId: string,
  episodeService: ItemsService
) => {
  return await episodeService.readByQuery({
    fields: ['id'],
    filter: {
      _and: [
        { organization_id: organizationId },
        {
          telvue_id: {
            _nnull: true
          }
        },
        {
          stream_url: {
            _null: true
          }
        }
      ]
    },
    limit: -1
  })
}

const createTelvueQueue = async (
  episodes: Episode,
  telvueQueueService: ItemsService
) => {
  const queueData = await telvueQueueData(-1, telvueQueueService)
  return episodes.map(async (episode: { episode_id: string }) => {
    if (queueData.indexOf(episode.episode_id) === -1) {
      await telvueQueueService.createOne(episode)
    }
    return null
  })
}

const telvueQueueData = async (
  limit: number,
  telvueQueueService: ItemsService
) => {
  const queueData = await telvueQueueService.readByQuery({
    fields: ['episode_id'],
    limit
  })
  return queueData.map((data: { episode_id: string }) => data.episode_id)
}

// Function to extract Telvue ID from metadata
const fetchTelvueConnectData = async (data: string) => {
  let telvue_connect_id, stream_url
  // Parsing XML to JavaScript object
  xml2js.parseString(data, (err, result) => {
    if (err) {
      console.error(err)
    } else {
      stream_url = result['content-file']['connect-vod-link'][0] // Extracting Telvue ID from parsed data
      telvue_connect_id = result['content-file']['medium-id'][0]['_']
    }
  })
  return { telvue_connect_id, stream_url }
}

const deleteTelvueQueue = async (telvueQueueService: ItemsService) => {
  return await telvueQueueService.deleteByQuery({
    limit: 100
  })
}

export {
  getUserData,
  getTelvueServerData,
  getEpisodeData,
  getProgramData,
  getProducerData,
  fetchTelvueId,
  createNotification,
  updateEpisode,
  getTelvueData,
  getTelvueEpisodeData,
  createTelvueQueue,
  telvueQueueData,
  fetchTelvueConnectData,
  deleteTelvueQueue
}
