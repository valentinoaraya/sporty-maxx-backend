import { getProductsFB, getProductByIdFB, addProductFB, editProductFB } from "../services/firebase.js";
import cloudinary from "../services/cloudinary.js";

export class ProductManager {
    constructor() {
        "Working with DB"
    }

    async getProducts(category) {
        try{
            const arrayProducts = await getProductsFB();
            if (!category) return arrayProducts;
            const productsToShow = arrayProducts.filter(product => product.categories.includes(category));
            return productsToShow;
        } catch (error){
            console.log(error)
        }
    }

    async getProductById(id) {
        try{
            const product = await getProductByIdFB(id);
            return product;
        }catch (error){
            console.log(error)
        }
    }

    async uploadImageToCloudinary(pathImage1, pathImage2) {
        try{
            const cloudinaryImage1 = await cloudinary.uploader.upload(pathImage1)
            const cloudinaryImage2 = await cloudinary.uploader.upload(pathImage2)
            const urlImagen = cloudinaryImage1.secure_url
            const urlImagenSecundaria = cloudinaryImage2.secure_url
            return [urlImagen, urlImagenSecundaria]
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }

    async addProduct(product) {
        try{
            product.precio = parseInt(product.precio);
            product.stock = parseInt(product.stock);
            product.categories = product.categories.split(",");
    
            const keys = Object.keys(product);
            const requiredKeys = ["imagen", "imagenSecundaria", "nombre", "precio", "stock", "categories"];
            for (const key of requiredKeys) {
                if (!keys.includes(key)) {
                    console.log("Missing required field: ", key);
                    throw new Error(`Missing required field: ${key}`);
                }
            }
    
            const values = Object.values(product);
            if (values.some(value => value === undefined || value === " " || value === "")) {
                console.log("No es posible enviar campos vacios");
                throw new Error("Missing required field");
            }
            await addProductFB(product)
            console.log(product)
            return "Product added";
        }catch(error){
            console.log(error)
        }
    }


    async editProduct(id, dataProduct) {
        try{
            if (dataProduct.precio) dataProduct.precio = parseInt(dataProduct.precio);
            if (dataProduct.stock) dataProduct.stock = parseInt(dataProduct.stock);
            if (dataProduct.categories) dataProduct.categories = dataProduct.categories.split(",");

            const response = await editProductFB(id, dataProduct)
            return response
        } catch (error) {
            console.log(error)
        }
    }
}