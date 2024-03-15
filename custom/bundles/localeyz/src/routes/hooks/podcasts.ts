import { podcaseScheduler, run } from '../../controllers/podcasts'
import { ControllerOptions, Cron } from '../../utils/helper'

// Define the interface for the keys object
interface Keys {
  key: string
  keys: string[]
  payload: {
    skipRecursion: boolean
    rss_feed: string
  }
}

/**
 * Represents a scheduled task for managing podcasts and their episodes.
 * @param {object} param0 - The action and schedule objects.
 * @param {object} context - The context object containing necessary data.
 */
export default ({ action, schedule }: Cron, context: ControllerOptions) => {
  // Define action for creating podcast items
  action(
    'podcasts.items.create',
    async (keys: Object, req: Request, _res: Response) => {
      const typedKeys = keys as Keys // Type assertion
      // Execute the run function from the podcasts controller for creating podcast items
      run(typedKeys.key, typedKeys?.payload?.rss_feed, context, req)
    }
  )

  // Define action for updating podcast items
  action(
    'podcasts.items.update',
    async (keys: Object, req: Request, _res: Response) => {
      const typedKeys = keys as Keys
      // Check if recursion is not skipped
      if (!typedKeys?.payload?.skipRecursion) {
        // Execute the run function from the podcasts controller for updating podcast items
        run(typedKeys.keys[0], typedKeys?.payload?.rss_feed, context, req)
      }
    }
  )

  // Schedule a task to run podcaseScheduler every 4 hours
  schedule(
    '0 */4 * * *',
    async (_keys: string[], req: Request, _res: Response) => {
      // Execute the podcaseScheduler function from the podcasts controller
      await podcaseScheduler(req, context)
    }
  )
}
