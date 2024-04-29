import { json, Router } from "express";
import { ProductManager } from "../db-managers/ProductManager.js";

const productsRouter = Router();
const productManager = new ProductManager();
productsRouter.use(json());

// Obtener los productos por categoría
productsRouter.get("/", async (req, res) => {
    try{
        const {category} = req.query
        let products = [];
        if (!category) products = await productManager.getProducts("destacado");
        else products = await productManager.getProducts(category);
        res.status(200).send({message: "Success", data: products}); 
    }catch(error){
        res.status(500).send(error.message);
    }
})

// Obtener un producto por ID
productsRouter.get("/item/:id", async (req, res) => {
    try{
        const {id} = req.params
        const product = await productManager.getProductById(id);
        res.status(200).send({message: "Success", data: product || "Product not found"});
    }catch(error){
        res.status(500).send(error.message);
    }
})

// Middleware de autorización para verificar el rol de administrador
const isAdmin = (req, res, next) => {
    try{
        const user = req.user;
        if (user && user.role === "admin") next();
        else res.status(403).send({error: "Unauthorized"});
    } catch (error){
        console.log(error)
    }
}

// Subir un nuevo producto (Solo lo podrá hacer el administrador)
productsRouter.post("/add-product/", isAdmin, (req, res) => {
    try{
        // TODO
    } catch (error){
        res.status(500).send(error.message);
    }
})

// Editar un producto (Solo lo podrá hacer el administrador)
productsRouter.put("/edit/:id", isAdmin, (req, res) => {
    // TODO
})

// Eliminar un producto (Solo lo podrá hacer el administrador)
productsRouter.delete("/delete/:id", isAdmin, (req, res) => {
    //TODO
})

export default productsRouter;