import { getProductsFB, getProductByIdFB, addProductFB, editProductFB, deleteProductFB } from "../services/firebase.js";

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

            return product
        }catch(error){
            console.log(error)
        }
    }

    async editProduct(dataProduct) {
        try{
            if (dataProduct.precio) dataProduct.precio = parseInt(dataProduct.precio);
            if (dataProduct.stock) dataProduct.stock = parseInt(dataProduct.stock);
            if (dataProduct.categories) dataProduct.categories = dataProduct.categories.split(",");

            return dataProduct
        } catch (error) {
            console.log(error)
        }
    }
}