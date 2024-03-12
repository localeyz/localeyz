import { telvueConnectSync } from '../../controllers/telvue'

// Export a function that defines a scheduled task
export default ({ schedule }: any, context: any) => {
  // Schedule a task to run every 30 minutes
  schedule('42 16 * * *', async (req: any, res: any) => {
    // When the task runs, call the telvueConnectSync function with the provided request, response, and context
    await telvueConnectSync(req, res, context)
  })
}
