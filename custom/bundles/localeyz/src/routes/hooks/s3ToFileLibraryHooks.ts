import { handler } from '../../controllers/s3ToFileLibrary'
import { ControllerOptions, Cron } from '../../utils/helper'

// Define the interface for the keys object
interface Keys {
  [key: string]: any // Adjust the type accordingly
  payload: {
    thumbnail_url: string
  }
}

/**
 * Represents a module for handling actions related to S3 file library.
 * @param {object} param0 - The action and context objects.
 * @param {object} context - The context object containing necessary data.
 */
export default ({ action }: Cron, context: ControllerOptions) => {
  // Define action for creating episodes
  action(
    'episodes.items.create',
    async (keys: Object, req: Object, _res: Response) => {
      const typedKeys = keys as Keys // Type assertion
      // Execute the handler function from the S3 to File Library controller for creating episodes
      await handler(
        typedKeys.payload?.thumbnail_url,
        typedKeys[0], // Adjust this accordingly based on the structure of the keys object
        context,
        req.accountability
      )
    }
  )

  // Define action for updating episodes
  action(
    'episodes.items.update',
    async (keys: Object, req: Request, _res: Response) => {
      const typedKeys = keys as Keys // Type assertion
      // Execute the handler function from the S3 to File Library controller for updating episodes
      await handler(
        typedKeys.payload?.thumbnail_url,
        typedKeys.keys[0], // Adjust this accordingly based on the structure of the keys object
        context,
        req.accountability
      )
    }
  )
}
