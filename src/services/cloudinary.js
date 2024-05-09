import "dotenv/config";
import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadImageToCloudinary = async (pathImage1) => {
    try{
        const folder = {
            folder: process.env.CLOUDINARY_FOLDER_TO_UPLOAD
        }
        const cloudinaryImage = await cloudinary.uploader.upload(pathImage1, folder)
        return cloudinaryImage
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export const uploadImagesToCloudinary = async (pathImage1, pathImage2) => {
    try{
        const folder = {
            folder: process.env.CLOUDINARY_FOLDER_TO_UPLOAD
        }
        const cloudinaryImage1 = await cloudinary.uploader.upload(pathImage1, folder)
        const cloudinaryImage2 = await cloudinary.uploader.upload(pathImage2, folder)
        return [cloudinaryImage1, cloudinaryImage2]
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export const deleteImageFromCloudinary = async (public_id) => {
    try{
        const folder = {
            folder: process.env.CLOUDINARY_FOLDER_TO_UPLOAD
        }
        await cloudinary.uploader.destroy(public_id, folder)
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export default cloudinary