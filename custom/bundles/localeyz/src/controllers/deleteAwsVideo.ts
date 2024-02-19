import '../utils/polyfills'
import { S3 } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { S3_CONFIG } from '../utils/config';
import { getEpisodes } from '../daos/deleteAwsVideo';

// Define the function for deleting AWS videos
const deleteAwsVideo = async (_req: any, _res: any, _keys: any, context: { getSchema: any; services: any; }) => {

    // Set up AWS S3 clients
    const s3 = new S3({
        credentials: {
            accessKeyId: S3_CONFIG.STORAGE_S3_KEY,
            secretAccessKey: S3_CONFIG.STORAGE_S3_SECRET,
        },
        region: S3_CONFIG.S3_REGION,
    });
    const bucketName = S3_CONFIG.S3_BUCKET;

    // Configure uuid to use Math.random() as a fallback
    uuidv4({ rng: () => [...Array(16)].map(() => Math.floor(Math.random() * 256)) });

    // Get schema and initialize service options
    const { getSchema, services } = context;
    const { ItemsService } = services;
    const schema = await getSchema();
    const serviceOptions = {
        schema: schema,
    };

    const episodeService = new ItemsService("episodes", serviceOptions);

    // Fetch episodes
    const episodes = await getEpisodes(episodeService);

    // Process episodes
    if (episodes?.length) {
        await Promise.all(episodes.map(async (episode: any) => {
            const videoUrl = episode.video_url;
            const s3Key = decodeURIComponent(videoUrl.split("/").slice(3).join('/'));

            try {
                // Get the last modified date of the file
                const response = await s3.headObject({
                    Bucket: S3_CONFIG.S3_BUCKET,
                    Key: s3Key
                });

                const lastModifiedDate = response.LastModified;

                // Check if the file is older than 7 days
                if (lastModifiedDate && ((new Date().getTime() - lastModifiedDate.getTime()) > (7 * 24 * 60 * 60))) {
                    await s3.deleteObject({ Bucket: bucketName, Key: s3Key });			// Delete the file from S3
                    await episodeService.updateOne(episode.id, { video_url: null })		// Update the video_url of the episode to empty
                } else {
                    console.log("File is not older than 7 days")
                }

            } catch (error: any) {
                console.error(`Error processing file ${s3Key}: ${error}`);
            }
        }));
    } else {
        console.log("No Episodes found")
    }
}

// Export the function
export { deleteAwsVideo }