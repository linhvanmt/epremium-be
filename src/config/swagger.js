import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger Documentation available at /api/v1/docs");
};
