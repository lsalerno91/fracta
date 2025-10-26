// this file configures and exports the Express app

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productsRoutes from "./routes/products.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN, 
  "http://localhost:9000",
  "http://127.0.0.1:9000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // consenti richieste senza origin (es. Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log("❌ Origin non consentito:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

// Swagger UI — visible only in non-production environments
if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Routes
app.use("/api/products", productsRoutes);

// Health
app.get("/", (req, res) => res.send("API Catalog active"));

// Error handler (should be last middleware)
app.use(errorHandler);

export default app;
