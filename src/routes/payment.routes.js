import { Router, json } from "express";
import preference from "../services/mercadoPago.js";

const paymentRouter = Router();
paymentRouter.use(json())

paymentRouter.post("/create-preference", async (req,res) => {

    try{

        const body = {
            items: req.body.productsToSend,
            back_urls: {
                success: "https://sporty-maxx.vercel.app/", // Cuando termina el pago exitosamente
                failure: "https://sporty-maxx.vercel.app/", // Error o el usuario presiona en "volver al sitio"
                pending: "https://sporty-maxx.vercel.app/"
            },
            auto_return: "approved"
        }

        const response = await preference.create({body})
        res.status(200).send({ id: response.id })

    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

export default paymentRouter