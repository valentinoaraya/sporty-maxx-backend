import { getProductsFB, getProductByIdFB } from "../services/firebase.js";

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
}