import { getProductsFB, getProductByIdFB, addProductFB } from "../services/firebase.js";
import cloudinary from "../services/cloudinary.js";

export class ProductManager {
    constructor() {
        "Working with DB"
    }

    async getProducts(category) {
        const arrayProducts = await getProductsFB();
        const productsToShow = arrayProducts.filter(product => product.categories.includes(category));
        return productsToShow;
    }

    async getProductById(id) {
        const product = await getProductByIdFB(id);
        return product;
    }

    async uploadImageToCloudinary(pathImage1, pathImage2) {
        const cloudinaryImage1 = await cloudinary.uploader.upload(pathImage1)
        const cloudinaryImage2 = await cloudinary.uploader.upload(pathImage2)
        const urlImagen =cloudinaryImage1.secure_url
        const urlImagenSecundaria = cloudinaryImage2.secure_url
        return [urlImagen, urlImagenSecundaria]
    }

    async addProduct(product) {
        const keys = Object.keys(product);
        const requiredKeys = ["imagen", "imagenSecundaria", "nombre", "precio", "stock", "categories"];
        for (const key of requiredKeys) {
            if (!keys.includes(key)) {
                console.log("Missing required field: ", key);
                throw new Error(`Missing required field: ${key}`);
            }
        }
        const [urlImagen, urlImagenSecundaria] = await this.uploadImageToCloudinary(product.imagen, product.imagenSecundaria);
        product.imagen = urlImagen;
        product.imagenSecundaria = urlImagenSecundaria;
        const values = Object.values(product);
        if (values.some(value => value === undefined || value === " " || value === "")) {
            console.log("No es posible enviar campos vacios");
            throw new Error("Missing required field");
        }
        await addProductFB(product)
        return "Product added";
    }
}