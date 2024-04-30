import { json, Router } from "express";
import { ProductManager } from "../db-managers/ProductManager.js";
import multer from "multer";
import path from "path";
import fs from "fs-extra";

const productsRouter = Router();
const productManager = new ProductManager();
productsRouter.use(json());

// Configurar multer para recibir archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
})

const upload = multer({storage: storage});

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
productsRouter.post("/add-product",  upload.fields([
    {name: "imagen", maxCount: 1},
    {name: "imagenSecundaria", maxCount: 1}
]), async (req, res) => {
    try{
        const product = req.body;
        const objectImage = req.files.imagen[0];
        const objectSecundaryImage = req.files.imagenSecundaria[0];
        const arrayURLs = await productManager.uploadImageToCloudinary(objectImage.path, objectSecundaryImage.path);
        product.imagen = arrayURLs[0];
        product.imagenSecundaria = arrayURLs[1];
        await productManager.addProduct(product);
        await fs.unlink(objectImage.path);
        await fs.unlink(objectSecundaryImage.path);
        res.status(200).send({message: "Success"});
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