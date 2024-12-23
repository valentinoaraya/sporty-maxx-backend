import express from "express";
import { PORT } from "./config.js";
import productsRouter from "./routes/products.routes.js";
import cors from "cors";
import ordersRouter from "./routes/orders.routes.js";
import paymentRouter from "./routes/payment.routes.js";

// Initializations
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
}));

// Routes
app.use("/", productsRouter);
app.use("/orders", ordersRouter);
app.use("/payments", paymentRouter);

// Endpoint para mantener el servidor activo
app.get("/ping", (req,res)=>{
    res.status(200).send("Pong!")    
})

// Listen server
app.listen(PORT, () => console.log("Server running on port " + PORT));