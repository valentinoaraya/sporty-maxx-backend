import { json, Router } from "express";
import admin from "../services/firebase-admin.js";
import { verificarTokenFirebase } from "../middlewares/verifyTokenMiddleware.js";
import { rateLimiter } from "../middlewares/ratelimitMiddleware.js";
import { createBuyOrder } from "../services/firebase.js";
import { sendEmail } from "../services/nodemailer.js";

const ordersRouter = Router();
ordersRouter.use(json());

// Obtener todas las órdenes
ordersRouter.get("/", verificarTokenFirebase, async (req, res) => {
    try {
        const ordersSanpshot = await admin.firestore().collection("orders").get();
        const orders = ordersSanpshot.docs.map((doc) => doc.data());
        res.status(200).send({ data: orders });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Subir órdenes a la base de datos
ordersRouter.post("/add-order", rateLimiter, async (req,res)=>{
    try{

        const order = req.body
        const keysOrder = Object.keys(order)
        const requiredKeysOrder = ["buyer", "date", "products", "total"]
        for (const key of requiredKeysOrder){
            if (!keysOrder.includes(key)){
                console.log("Orden incompleta")
                throw new Error(`Missing required field: ${key}`);
            }
        }
        
        const buyer = order.buyer
        const keysBuyer = Object.keys(buyer)
        const requiredKeysBuyer = ["nombre", "email", "telefono", "direccion"]
        for (const key of requiredKeysBuyer){
            if (!keysBuyer.includes(key)){
                console.log("Orden incompleta")
                throw new Error(`Missing required field: ${key}`)
            }
        }

        if (order.products.length === 0){
            throw new Error("No hay productos en la orden de compra")
        }

        // 3. Subir la orden a la base de datos
        let newOrder = null
        if (buyer.id){
            newOrder = await createBuyOrder(order, buyer.id)
        } else {
            newOrder = await createBuyOrder(order, null)
        }

        // 4. Enviar correo al comprador y al vendedor
        // Vendedor
        const subjectVendedor = "Alguien ha creado una nueva orden de compra"
        const textoVendedor = "Texto hacia el vendedor"
        const htmlVendedor = `<h1>Hola Vendedor!</h1>
                              <h2>El usuario ${buyer.nombre} ha creado la orden de compra: #${newOrder.id}</h2>`
        await sendEmail("varayaamaya@gmail.com", subjectVendedor, textoVendedor, htmlVendedor)

        // Comprador
        const subjectComprador = "Has creado una orden de compra"
        const textoComprador = "Texto hacia el comprador"
        const htmlComprador = `<h1>Hola ${buyer.nombre}</h1>
                               <h2>Se ha creado tu orden de compra: #${newOrder.id}</h2>`
        await sendEmail(`${buyer.email}`, subjectComprador, textoComprador, htmlComprador)

        res.status(200)
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})


export default ordersRouter;
