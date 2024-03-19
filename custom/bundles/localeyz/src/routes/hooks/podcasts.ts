import { podcaseScheduler, run } from '../../controllers/podcasts'
import { ControllerOptions, Cron, Keys } from '../../utils/helper'

/**
 * Represents a scheduled task for managing podcasts and their episodes.
 * @param {object} param0 - The action and schedule objects.
 * @param {object} context - The context object containing necessary data.
 */
export default ({ action, schedule }: Cron, context: ControllerOptions) => {
  // Define action for creating podcast items
  action('podcasts.items.create', async (keys: Keys, req?: Request) => {
    // Execute the run function from the podcasts controller for creating podcast items
    run(keys.key, keys?.payload?.rss_feed, context, req)
  })

  // Define action for updating podcast items
  action('podcasts.items.update', async (keys: Keys, req?: Request) => {
    // Check if recursion is not skipped
    if (!keys?.payload?.skipRecursion) {
      // Execute the run function from the podcasts controller for updating podcast items
      run(keys.keys[0], keys?.payload?.rss_feed, context, req)
    }
  })

  // Schedule a task to run podcaseScheduler every 4 hours
  schedule('0 */4 * * *', async (_keys?: string[], req?: Request) => {
    // Execute the podcaseScheduler function from the podcasts controller
    await podcaseScheduler(req, context)
  })
}
