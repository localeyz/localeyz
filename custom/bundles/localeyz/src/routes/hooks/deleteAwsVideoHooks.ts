import { deleteAwsVideo } from "../../controllers/deleteAwsVideo";

/**
 * Represents a scheduled task for deleting AWS videos.
 * @interface Schedule
 */
interface Schedule {
    /**
     * Schedule a task to run at specified intervals.
     * @param {string} cronTab - The cron expression defining the schedule.
     * @param {Function} callback - The callback function to execute at each scheduled interval.
     *                              Takes an array of keys, request object, and response object as parameters.
     * @returns {any} - Returns the scheduled task.
     */
    schedule: (cronTab: string, callback: (keys: string[], req: any, res: any) => Promise<any>) => any;
}

/**
 * Schedule a task to delete AWS videos at specific intervals.
 * @param {Schedule} param0 - The schedule object and context for the scheduled task.
 * @param {any} context - The context object containing necessary data for the scheduled task.
 */
export default ({ schedule }: Schedule, context: any) => {
    // Schedule the task to run at 12:00 AM and 12:00 PM every day
    schedule('0 0,12 * * *', async (keys: string[], req: any, res: any) => {
        // Call the deleteAwsVideo function from the deleteAwsVideo controller
        await deleteAwsVideo(req, res, keys, context);
    });
};
