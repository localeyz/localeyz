import axios from 'axios';
import jwt from 'jsonwebtoken';
import { ACCOUNTABILITY, SECRET, PUBLIC_URL } from "../utils/config";
import { uploadImage } from '../daos/global';

// Function responsible for synchronizing data with Telvue
const globalImage = async (req: any, res: any, keys: any, context: any) => {
    try {
        const { getSchema, services } = context;
        const { ItemsService } = services;
        const schema = await getSchema();
        const accountability = req.accountability;

        // Extract necessary data from keys
        const collection = keys?.collection;
        const key = keys.key ? keys.key : keys?.keys[0];
        const image = keys?.payload?.image || keys?.payload?.image_url;
        const collections = ['groups', 'live_video_episodes', 'live_videos', 'organizations', 'podcast_episodes', 'producer_portal_widgets', 'radios']

        // Check if the collection requires image synchronization and if an image is provided
        if (collections.indexOf(collection) !== -1 && image) {
            const service = new ItemsService(collection, { schema, ACCOUNTABILITY });
            // Create JWT token
            const token = createJwtToken(ACCOUNTABILITY);
            // Image handler
            await handler({
                url: image,
                keys: key,
                user: accountability?.user,
                token,
                service
            });
        }
    } catch (error: any) {
        console.log(error.message)
    }
}

// Function to create JWT token
const createJwtToken = (accountability: any) => {
    const { user, role, admin, app } = accountability;
    const id = user;

    const payload = {
        id,
        role,
        app_access: app,
        admin_access: admin,
        iat: Math.floor(Date.now() / 1000), // Issued at time in seconds
        exp: Math.floor(Date.now() / 1000) + (60), // Expiry time in seconds (1 Min)
        iss: "directus"
    };

    return jwt.sign(payload, SECRET);
};

// Handler function to handle URL and update podcast image
const handler = async ({ url, keys, user, token, service }: { url: string | null | undefined, keys: string, user?: string | null, token: string, service: any }) => {
    if (!url) {
        return;
    }

    try {
        const res = await axios.post(
            `${PUBLIC_URL}/files/import`,
            {
                url,
                data: {
                    uploaded_by: { id: user },
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        // Upload image and update in service
        await uploadImage(keys, res.data.data.id, service)
        return res.data.data.id;
    } catch (error: any) {
        console.error('Error handling URL:', error, error.data);
        throw error;
    }
};


export { globalImage };
