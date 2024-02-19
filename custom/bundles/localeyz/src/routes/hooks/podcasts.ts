import { podcaseScheduler, run } from "../../controllers/podcasts";

/**
 * Represents a scheduled task for managing podcasts and their episodes.
 * @param {object} param0 - The action and schedule objects.
 * @param {object} context - The context object containing necessary data.
 */
export default ({ action, schedule }: any, context: any) => {
    // Define action for creating podcast items
    action('podcasts.items.create', async (keys: any, req: any, res: any) => {
        // Execute the run function from the podcasts controller for creating podcast items
        run(keys.key, keys?.payload?.rss_feed, context, req, res);
    });

    // Define action for updating podcast items
    action('podcasts.items.update', async (keys: any, req: any, res: any) => {
        // Check if recursion is not skipped
        if (!keys?.payload?.skipRecursion) {
            // Execute the run function from the podcasts controller for updating podcast items
            run(keys?.keys?.[0], keys?.payload?.rss_feed, context, req, res);
        }
    });

    // Schedule a task to run podcaseScheduler every 4 hours
    schedule('0 */4 * * *', async (req: any, res: any) => {
        // Execute the podcaseScheduler function from the podcasts controller
        await podcaseScheduler(req, res, context);
    });
}
