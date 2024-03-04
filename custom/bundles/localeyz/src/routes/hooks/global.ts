import { globalImage } from "../../controllers/global";

// This function is a middleware that handles image uploads for creating and updating items.
export default ({ action }: any, context: any) => {
    // Action to create items
    action('items.create', async (keys: any, req: any, res: any) => {
        await globalImage(req, res, keys, context);
    });

    // Action to update items
    action('items.update', async (keys: any, req: any, res: any) => {
        await globalImage(req, res, keys, context);
    });
}
