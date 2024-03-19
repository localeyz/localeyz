import { handler } from '../../controllers/s3ToFileLibrary'
import { ControllerOptions, Cron, Keys } from '../../utils/helper'

/**
 * Represents a module for handling actions related to S3 file library.
 * @param {object} param0 - The action and context objects.
 * @param {object} context - The context object containing necessary data.
 */
export default ({ action }: Cron, context: ControllerOptions) => {
  // Define action for creating episodes
  action('episodes.items.create', async (keys: Keys, req?: Request) => {
    // Execute the handler function from the S3 to File Library controller for creating episodes
    await handler(
      keys.payload?.thumbnail_url,
      keys[0], // Adjust this accordingly based on the structure of the keys object
      context,
      req.accountability
    )
  })

  // Define action for updating episodes
  action('episodes.items.update', async (keys: Keys, req?: Request) => {
    // Execute the handler function from the S3 to File Library controller for updating episodes
    await handler(
      keys.payload?.thumbnail_url,
      keys.keys[0], // Adjust this accordingly based on the structure of the keys object
      context,
      req.accountability
    )
  })
}
