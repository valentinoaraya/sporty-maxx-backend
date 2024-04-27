import express from "express";
import { PORT } from "./config.js";
import productsRouter from "./routes/products.routes.js";

// Initializations
const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/", productsRouter);


// Listen server
app.listen(PORT, () => console.log("Server running on port " + PORT));