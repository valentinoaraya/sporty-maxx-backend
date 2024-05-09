import express from "express";
import { PORT } from "./config.js";
import productsRouter from "./routes/products.routes.js";
import cors from "cors";

// Initializations
const app = express();

// Configurations cors
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use("/", productsRouter);


// Listen server
app.listen(PORT, () => console.log("Server running on port " + PORT));