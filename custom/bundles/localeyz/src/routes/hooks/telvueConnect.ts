import { telvueConnectSync } from '../../controllers/telvue'
import { ControllerOptions, Cron } from '../../utils/helper'

// Export a function that defines a scheduled task
export default ({ schedule }: Cron, context: ControllerOptions) => {
  // Schedule a task to run every 30 minutes
  schedule('*/30 * * * *', async () => {
    // When the task runs, call the telvueConnectSync function with the provided request, response, and context
    await telvueConnectSync(context)
  })
}
