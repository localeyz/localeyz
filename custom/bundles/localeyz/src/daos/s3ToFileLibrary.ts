/**
 * Checks if a given URL string is valid.
 * @param {string} url - The URL string to validate.
 * @returns {boolean} - Returns true if the URL is valid, false otherwise.
 */
const isURLValid = (url: string): boolean => {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

/**
 * Updates an episode in the database with the provided data.
 * @param {string} keys - The primary key(s) of the episode to update.
 * @param {any} data - The data object containing the fields to update.
 * @param {any} episodesService - The service used to interact with episodes.
 * @returns {Promise<void>} - A promise that resolves once the episode is updated.
 */
const updateEpisode = async (keys: string, data: any, episodesService: any): Promise<void> => {
    await episodesService.updateOne(keys, data)
}

export { isURLValid, updateEpisode }