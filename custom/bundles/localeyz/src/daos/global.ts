const uploadImage = async (keys: string, imageId: string, service: any): Promise<any> => {
    return await service.updateOne(keys, {
        directus_image: imageId
    });
}

export { uploadImage };
