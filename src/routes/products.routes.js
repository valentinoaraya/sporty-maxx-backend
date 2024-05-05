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
        products = await productManager.getProducts(category);
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
        console.log(error)
    }
})

// Middleware de autorización para verificar el rol de administrador
const isAdmin = (req, res, next) => {
    try{
        console.log("req body: ", req.body)
        const {userRole} = req.body;
        console.log(userRole)
        console.log( userRole === 'admin')
        if (userRole === 'admin') next();
        else res.status(403).send({error: "Unauthorized"});
    } catch (error){
        console.log(error)
    }
}

// Subir un nuevo producto (Solo lo podrá hacer el administrador)
productsRouter.post("/add-product",  upload.fields([
    {name: "imagen", maxCount: 1},
    {name: "imagenSecundaria", maxCount: 1}
]), isAdmin, async (req, res) => {
    try{
        //Creo el producto
        const {nombre, precio, stock, categories} = req.body;
        const product = {nombre, precio, stock, categories};

        //Obtengo las imágenes
        const objectImage = req.files.imagen[0];
        const objectSecundaryImage = req.files.imagenSecundaria[0];
        console.log(objectImage)
        console.log(objectSecundaryImage)

        //Subo las imagenes y obtengo sus URLs
        const arrayURLs = await productManager.uploadImageToCloudinary(objectImage.path, objectSecundaryImage.path);
        console.log(arrayURLs)
        product.imagen = arrayURLs[0];
        product.imagenSecundaria = arrayURLs[1];

        //Agrego el producto a la base de datos y borro las imágenes de uploads
        await productManager.addProduct(product);
        await fs.unlink(objectImage.path);
        await fs.unlink(objectSecundaryImage.path);
        res.status(200).send({message: "Success"});
    } catch (error){
        console.log(error)
        res.status(500).send(error);
    }
})

// Editar un producto (Solo lo podrá hacer el administrador)
productsRouter.put("/edit-product/:id", isAdmin, (req, res) => {
    // TODO
})

// Eliminar un producto (Solo lo podrá hacer el administrador)
productsRouter.delete("/delete/:id", isAdmin, (req, res) => {
    //TODO
})

export default productsRouter;