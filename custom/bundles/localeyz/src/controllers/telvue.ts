import axios from 'axios';
import { createNotification, fetchTelvueId, getEpisodeData, getProducerData, getProgramData, getTelvueServerData, getUserData, updateEpisode } from "../daos/telvue";
import { ACCOUNTABILITY, TELVUE_URL } from "../utils/config";

// Function responsible for synchronizing data with Telvue
const telvueSync = async (req: any, res: any, { services }: any) => {
    try {
        const { ItemsService } = services; // Destructuring ItemsService from services
        const { episodes, accountability } = req.body; // Destructuring episodes and accountability from request body

        const adminAccountability = ACCOUNTABILITY;

        // Creating service instances for Directus collections
        const usersService = new ItemsService('directus_users', { schema: req.schema, accountability });
        const telvueService = new ItemsService('telvue_integrations', { schema: req.schema, accountability });
        const episodesService = new ItemsService('episodes', { schema: req.schema, adminAccountability });
        const programsService = new ItemsService('programs', { schema: req.schema, accountability });
        const notificationService = new ItemsService('directus_notifications', { schema: req.schema, adminAccountability });

        // Fetching user data based on accountability user ID
        const userData = await getUserData(accountability.user, usersService)

        // Fetching server data based on user's organization
        const serverData = await getTelvueServerData(userData.organization, telvueService)

        // Iterating over episodes to create/update Telvue content
        episodes.map(async (episode: string) => {
            // Fetching episode Details
            const episodeData = await getEpisodeData(episode, episodesService)

            // Fetching program Details
            const programData = await getProgramData(episodeData.program_id, programsService)

            // Fetching producer details
            const producerData = await getProducerData(episodeData.producer_id, usersService)

            // Creating params object to create/update the telvue content
            const telvueParams = {
                program_code: programData?.telvue_program_code,
                program: programData?.title,
                episode_code: episodeData.telvue_episode_code,
                episode: episodeData.title,
                description: episodeData.full_description,
                expected_duration: episodeData.time?.split(':').reduce((acc: number, val: number, i: number | string) => acc + val * [3600, 60, 1][i], 0),
                expected_filename: episodeData.telvue_file_name,
                location: 'here',
                contributor: producerData.first_name + ' ' + producerData.last_name,
                import_datetime: episodeData.telvue_ingest_date_time?.split("T")[0],
                delete_datetime: episodeData.telvue_delete_at?.split("T")[0],
                categories: episodeData.topics?.map((topic: { topic_id: { title: any; }; }) => `categories[]=${encodeURIComponent(topic.topic_id.title)}`).join('&'),
                custom_metadata: episodeData.custom_field_value ? Object.entries(episodeData.custom_field_value)?.map(([key, value]) => `custom_metadata[${key}]=${value}`).join("&") : null,
                api_key: serverData.api_key
            }

            const telvueId = episodeData.telvue_id;

            if (telvueId) { // If telvueId exists, update Telvue content
                await axios.post(`${TELVUE_URL}/content_api/${telvueId}/edit?program_code=${telvueParams.program_code}&program=${telvueParams.program}&episode_code=${telvueParams.episode_code}&episode=${telvueParams.episode}&description=${telvueParams.description}&expected_duration=${telvueParams.expected_duration}&expected_filename=${telvueParams.expected_filename}&location=here&contributor=${telvueParams.contributor}&import_datetime=${telvueParams.import_datetime}&delete_datetime=${telvueParams.delete_datetime}&categories[]=${telvueParams.categories}&${telvueParams.custom_metadata}&api_key=${telvueParams.api_key}`);
                await createNotification(userData.id, 'Telvue Updates', `Telvue Content for episode Id ${episode} is updated`, 'episodes', episode, notificationService);
            } else { // If telvueId doesn't exist, create new Telvue content
                const createTelvueContent = await axios.post(`${TELVUE_URL}/content_api/new?program_code=${telvueParams.program_code}&program=${telvueParams.program}&episode_code=${telvueParams.episode_code}&episode=${telvueParams.episode}&description=${telvueParams.description}&expected_duration=${telvueParams.expected_duration}&expected_filename=${telvueParams.expected_filename}&location=here&contributor=${telvueParams.contributor}&import_datetime=${telvueParams.import_datetime}&delete_datetime=${telvueParams.delete_datetime}&categories[]=${telvueParams.categories}&${telvueParams.custom_metadata}&api_key=${telvueParams.api_key}`);
                if (createTelvueContent.data) { // If Telvue content creation is successful
                    const telvueData = await axios.get(`${TELVUE_URL}/content_metadata_by_filename/${telvueParams.expected_filename}`);
                    const createdTelvueId = fetchTelvueId(telvueData?.data);  // Fetching Telvue ID from metadata
                    await updateEpisode(episode, createdTelvueId, episodesService); // Updating episode with Telvue ID
                    await createNotification(userData.id, 'Telvue Id Created', `Telvue record is created for Episode Id: ${episode}`, 'episodes', episode, notificationService);
                } else { // If Telvue content creation fails
                    await createNotification(userData.id, 'Telvue Id creation fails', `Telvue record was not created for Episode Id: ${episode}`, 'episodes', episode, notificationService);
                }
            }
        })

        res.send('Sucess!')
    } catch (error: any) {
        res.send(error.message)
    }
}

export { telvueSync };
