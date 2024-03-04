import xml2js from 'xml2js';

// Function to fetch user data based on user ID
const getUserData = async (user: string, usersService: any) => {
    return await usersService.readSingleton({
        filter: {
            "id": user
        }
    })
}

// Function to fetch Telvue server data based on organization ID
const getTelvueServerData = async (organizationId: string, telvueService: any) => {
    return await telvueService.readSingleton({
        filter:
        {
            "organization_id": organizationId
        }
    })
}

// Function to fetch episode data based on episode ID
const getEpisodeData = async (episode: string, episodesService: any) => {
    return await episodesService.readSingleton({
        fields: ["*", "topics.topic_id.title"],
        filter: {
            "id": episode
        }
    })
}

// Function to fetch program data based on program ID
const getProgramData = async (programId: string, programsService: any) => {
    return await programsService.readSingleton({
        filter: {
            "id": programId
        }
    })
}

// Function to fetch producer data based on producer ID
const getProducerData = async (producerId: string, usersService: any) => {
    return await usersService.readSingleton({
        "filter": {
            "id": producerId
        }
    })

}

// Function to update episode with Telvue ID
const updateEpisode = async (id: string, createdTelvueId: string | undefined, episodesService: any) => {
    return await episodesService.updateOne(id,
        { telvue_id: createdTelvueId }
    )
}

// Function to create a notification
const createNotification = async (userId: string, subject: string, message: string, collection: string, item: string, notificationService: any) => {
    return await notificationService.createOne({
        status: 'inbox',
        recipient: userId,
        sender: userId,
        subject,
        message,
        collection,
        item
    })
}

// Function to extract Telvue ID from metadata
const fetchTelvueId = function (data: any) {
    let telvueId;
    // Parsing XML to JavaScript object
    xml2js.parseString(data, (err: any, result: any) => {
        if (err) {
            console.error(err);
        } else {
            telvueId = result['content-file']['id'][0]['_']; // Extracting Telvue ID from parsed data
        }
    });
    return telvueId;
};

export { getUserData, getTelvueServerData, getEpisodeData, getProgramData, getProducerData, fetchTelvueId, createNotification, updateEpisode }
