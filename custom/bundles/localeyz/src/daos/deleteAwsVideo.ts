/**
 * Retrieves episodes with non-null and non-empty video URLs.
 * @param {any} episodeService - The service used to interact with episodes.
 * @returns {Promise<any>} - A promise that resolves to episodes with non-null and non-empty video URLs.
 */
const getEpisodes = async (episodeService: any): Promise<any> => {
    return await episodeService.readByQuery({
        filter: {
            _and: [
                {
                    video_url: {
                        _nnull: true // Filter for non-null video URLs
                    }
                },
                {
                    video_url: {
                        _nempty: true // Filter for non - empty video URLs
                    }
                },
            ]
        },
        limit: -1 // Retrieve all matching episodes
    })
}

export { getEpisodes }
