import { handler } from '../../controllers/s3ToFileLibrary'

/**
 * Represents a module for handling actions related to S3 file library.
 * @param {object} param0 - The action and context objects.
 * @param {object} context - The context object containing necessary data.
 */
export default ({ action }: any, context: any) => {
  // Define action for creating episodes
  action('episodes.items.create', async (keys: any, req: any, res: any) => {
    // Execute the handler function from the S3 to File Library controller for creating episodes
    await handler(
      req.payload?.thumbnail_url,
      keys[0],
      context,
      req.accountability
    )
  })

  // Define action for updating episodes
  action('episodes.items.update', async (keys: any, req: any, res: any) => {
    // Execute the handler function from the S3 to File Library controller for updating episodes
    await handler(
      req.payload?.thumbnail_url,
      keys[0],
      context,
      req.accountability
    )
  })
}
