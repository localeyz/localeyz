import { globalImage, globalImageScheduler } from '../../controllers/global'
import { ControllerOptions, Cron, Keys } from '../../utils/helper'

// This function is a middleware that handles image uploads for creating and updating items.
export default ({ action, schedule }: Cron, context: ControllerOptions) => {
  // Action to create items
  action('items.create', async (keys: Keys, req?: Request) => {
    await globalImage(req, keys, context)
  })

  // Action to update items
  action('items.update', async (keys: Keys, req?: Request) => {
    await globalImage(req, keys, context)
  })

  // Scheduler to update images for existing data which execute at 00:00 on Friday
  schedule('0 0 * * 5', async () => {
    // Execute the globalImageScheduler function from the global controller
    await globalImageScheduler(context)
  })
}
