import { deleteAwsVideo } from '../../controllers/deleteAwsVideo'
import { ControllerOptions, Cron } from '../../utils/helper'

/**
 * Schedule a task to delete AWS videos at specific intervals.
 * @param {Schedule} param0 - The schedule object and context for the scheduled task.
 * @param {any} context - The context object containing necessary data for the scheduled task.
 */
export default (
  { schedule }: Cron,
  { getSchema, services }: ControllerOptions
) => {
  // Schedule the task to run at 12:00 AM and 12:00 PM every day
  schedule(
    '0 0,12 * * *',
    async (keys: string[], _req: Request, _res: Response) => {
      // Call the deleteAwsVideo function from the deleteAwsVideo controller
      await deleteAwsVideo(keys, { getSchema, services })
    }
  )
}
