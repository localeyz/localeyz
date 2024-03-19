import { ItemsService } from '../utils/helper'

/**
 * Uploads an image to a service.
 *
 * @param keys - The keys to identify the entity to update.
 * @param imageId - The ID of the image to upload.
 * @param field - The field in which to store the image ID.
 * @param service - The service responsible for updating the entity.
 * @returns A promise that resolves with the result of the update operation.
 */
const uploadImage = async (
  keys: string,
  imageId: string,
  field: string,
  service: ItemsService
): Promise<string> => {
  return await service.updateOne(keys, {
    [field]: imageId
  })
}

/**
 * Fetches data from a service based on specified criteria.
 *
 * @param urlField - The field containing URLs to filter by.
 * @param imageField - The field containing image data to check for existence.
 * @param service - The service responsible for fetching data.
 * @param chunkSize - The number of records to fetch in a single request.
 * @param offset - The offset from which to start fetching records.
 * @returns A promise that resolves with the fetched data.
 */
const fetchData = async (
  urlField: string,
  imageField: string,
  service: ItemsService,
  chunkSize: number,
  offset: number
) => {
  return await service.readByQuery({
    filter: {
      [urlField]: {
        _nnull: true // Filter URLs that are not null
      },
      [urlField]: {
        _empty: false // Filter URLs that are not empty
      },
      [imageField]: {
        _nnull: false // Filter image fields that are not null
      },
      _and: []
    },
    limit: chunkSize, // Limit the number of records fetched per request
    offset // Start fetching records from this offset
  })
}

export { uploadImage, fetchData }
