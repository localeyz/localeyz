import { Episode, ItemsService } from '../utils/helper'

//  Checks if a given URL string is valid.
const isURLValid = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Updates an episode in the database with the provided data.
const updateEpisode = async (
  keys: string,
  data: Episode,
  episodesService: ItemsService
): Promise<void> => {
  await episodesService.updateOne(keys, data)
}

export { isURLValid, updateEpisode }
