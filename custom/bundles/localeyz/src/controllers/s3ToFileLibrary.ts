import axios from 'axios'
import { isURLValid, updateEpisode } from '../daos/s3ToFileLibrary'
import { PUBLIC_URL } from '../utils/config'
import { createJwtToken } from './podcasts'

// Handler function to handle thumbnail updates
const handler = async (
    url: string | null | undefined,
    keys: string,
    context: any,
    accountability: any,
) => {
    // Destructure services and getSchema from context
    const { services, getSchema } = context
    const { ItemsService } = services;

    // Create an instance of ItemsService for 'episodes' collection
    const episodesService = new ItemsService('episodes', { accountability, schema: await getSchema() });
    // Check if URL is undefined
    if (typeof url === 'undefined') {
        return;  // field not edited
    } else if (url === null) {
        await updateEpisode(keys, { thumbnail: null }, episodesService) // field updated to an empty string
    } else if (isURLValid(url)) {
        // Field updated to a valid URL, proceed to upload thumbnail
        const token = createJwtToken(accountability)

        // Upload thumbnail using axios POST request
        const res = await axios.post(
            `${PUBLIC_URL}/files/import`,
            {
                url: url,
                data: {
                    uploaded_by: { id: accountability.user },
                    filename_download: url.split('/').pop() || 'thumbnail',
                    storage: 's3',
                    folder: {
                        name: 'thumbnails',
                        id: 'a304941f-dae5-4034-a003-313816f545ee'
                    },
                    title: 'Episode thumbnail'
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        // Update episode with the uploaded thumbnail's ID
        await updateEpisode(keys, { thumbnail: res.data.data.id }, episodesService)
    }
}

// Export handler function
export { handler }
