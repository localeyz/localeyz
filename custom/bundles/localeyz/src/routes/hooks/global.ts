import { globalImage, globalImageScheduler } from '../../controllers/global'

// This function is a middleware that handles image uploads for creating and updating items.
export default ({ action, schedule }: any, context: any) => {
  // Action to create items
  action('items.create', async (keys: any, req: any, res: any) => {
    await globalImage(req, res, keys, context)
  })

  // Action to update items
  action('items.update', async (keys: any, req: any, res: any) => {
    await globalImage(req, res, keys, context)
  })

  // Scheduler to update images for existing data which execute at 00:00 on Friday
  schedule('0 0 * * 5', async (req: any, res: any) => {
    // Execute the podcaseScheduler function from the podcasts controller
    await globalImageScheduler(req, res, context)
  })
}
