import { json, Router } from "express";
import admin from "../services/firebase-admin.js";
import { verificarTokenFirebase } from "../middlewares/verifyTokenMiddleware.js";
import { rateLimiter } from "../middlewares/ratelimitMiddleware.js";
import { createBuyOrder } from "../services/firebase.js";

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

// Obtener las órdenes de un usuario
//ordersRouter.get("/user-orders")

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
        if (buyer.id){
            await createBuyOrder(order, buyer.id)
        } else {
            await createBuyOrder(order, null)
        }

        // 4. Enviar correo al comprador y al vendedor
        // TODO

        res.status(200)
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})


export default ordersRouter;
