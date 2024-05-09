import { json, Router } from "express";
import { ProductManager } from "../db-managers/ProductManager.js";
import multer from "multer";
import path from "path";
import fs from "fs-extra";
import {uploadImageToCloudinary, uploadImagesToCloudinary, deleteImageFromCloudinary } from "../services/cloudinary.js";

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
        console.log(error)
        res.status(500).send(error.message);
    }
})

// Middleware de autorización para verificar el rol de administrador
// Con este middlewre, además, también se parsean los formDatas enviados por el cliente
// para que el back pueda leerlos como JSON u objetos.
const isAdmin = (req, res, next) => {
    try{
        const {userRole} = req.body;
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
        
        //Subo las imagenes y obtengo sus URLs
        const images = await uploadImagesToCloudinary(objectImage.path, objectSecundaryImage.path);
        product.imagen = {
            public_id: images[0].public_id,
            url: images[0].secure_url
        };
        product.imagenSecundaria = {
            public_id: images[1].public_id,
            url: images[1].secure_url
        };

        //Agrego el producto a la base de datos y borro las imágenes de uploads
        const response = await productManager.addProduct(product)
        await fs.unlink(objectImage.path);
        await fs.unlink(objectSecundaryImage.path);

        res.status(200).send({message: response});
    } catch (error){
        console.log(error)
        res.status(500).send(error);
    }
})

// Editar un producto (Solo lo podrá hacer el administrador)
productsRouter.put("/edit-product/:id", upload.fields([
    {name: "imagen", maxCount: 1},
    {name: "imagenSecundaria", maxCount: 1}
]), isAdmin, async (req, res) => {
    try{
        const {id} = req.params;
        const dataProduct = req.body;
        delete dataProduct.userRole
        console.log("id: ", id );
        console.log("dataProduct: ", dataProduct);

        //Obtengo las imágenes, si hay imágenes quiere decir que debo obtener las imágnes viejas y borrarlas de cloudinary
        if (req.files.imagen){
            const objectImage = req.files.imagen[0];

            //obtengo la imagen vieja y la elimino
            const product = await productManager.getProductById(id);
            const idImage = product.imagen.public_id;
            await deleteImageFromCloudinary(idImage);

            //agrego las imágenes neuvas
            const image = await uploadImageToCloudinary(objectImage.path);
            dataProduct.imagen = {
                public_id: image.public_id,
                url: image.secure_url
            }

            //borro la imagen de uploads
            await fs.unlink(objectImage.path);

            console.log("objectImage: ", objectImage);
        } else {
            console.log("No hay imagen en el form")
        }

        if (req.files.imagenSecundaria){
            const objectSecundaryImage = req.files.imagenSecundaria[0];

            //obtengo la imagen vieja y la elimino
            const product = await productManager.getProductById(id);
            const idImage = product.imagenSecundaria.public_id;
            await deleteImageFromCloudinary(idImage);

            //agrego las imágenes neuvas
            const image = await uploadImageToCloudinary(objectSecundaryImage.path);
            dataProduct.imagenSecundaria = {
                public_id: image.public_id,
                url: image.secure_url
            }

            //borro la imagen de uploads
            await fs.unlink(objectSecundaryImage.path);

            console.log("objectSecundaryImage: ", objectSecundaryImage);
        } else {
            console.log("No hay imagen secundaria en el form")
        }

        const response = await productManager.editProduct(id, dataProduct);
        res.status(200).send({message: "Success", data: response});
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

// Eliminar un producto (Solo lo podrá hacer el administrador)
productsRouter.post("/delete-product/:id", isAdmin, async (req, res) => {
    try{
        const {id} = req.params;
        const response = await productManager.deleteProduct(id);

        // una vez eliminado el producto elimino sus imágenes de cloudinary
        await deleteImageFromCloudinary(response.imagen.public_id);
        await deleteImageFromCloudinary(response.imagenSecundaria.public_id);
         
        res.status(200).send({message: "Success", data: response});
    } catch (error){
        console.log(error)
        res.status(500).send(error);
    }
})

export default productsRouter;