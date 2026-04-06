import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Premium English Center API",
      version: "1.0.0",
      description: "Comprehensive documentation for the E-Premium administrative and student backend services.",
      contact: {
        name: "E-Premium Support",
        email: "support@epremium.vn",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
      {
        url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://epremium-be.vercel.app",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [join(__dirname, "../routes/*.js"), join(__dirname, "../controllers/*.js")], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  try {
    app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("Swagger Documentation available at /api/v1/docs");
  } catch (error) {
    console.error("Error setting up Swagger:", error.message);
  }
};
