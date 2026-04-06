import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express from "express";

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
    paths: {
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Check API health status",
          responses: {
            "200": {
              description: "API is operational",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      timestamp: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "User login",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Login successful" },
            "401": { description: "Invalid credentials" },
          },
        },
      },
      "/api/v1/courses": {
        get: {
          tags: ["Courses"],
          summary: "Get all courses",
          responses: {
            "200": { description: "List of courses" },
          },
        },
      },
      "/api/v1/users": {
        get: {
          tags: ["Users"],
          summary: "Get all users",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "List of users" },
            "401": { description: "Unauthorized" },
          },
        },
      },
    },
  },
  apis: [], // Don't auto-scan for now
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  try {
    const swaggerUiAssets = join(dirname(new URL(import.meta.url).pathname), "../node_modules/swagger-ui-express/static");
    
    const swaggerUiOptions = {
      customCss: '.swagger-ui { font-family: sans-serif; }',
      customJs: '',
      swaggerUrl: undefined,
      customSiteTitle: 'E-Premium API Docs',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'list',
    };
    
    // Serve swagger-ui static files
    app.use("/api/v1/docs", express.static(swaggerUiAssets));
    app.use("/api/v1/docs", swaggerUi.serve);
    app.get("/api/v1/docs", swaggerUi.setup(swaggerSpec, swaggerUiOptions));
    app.get("/api/v1/docs/", swaggerUi.setup(swaggerSpec, swaggerUiOptions));
    
    console.log("Swagger Documentation available at /api/v1/docs");
  } catch (error) {
    console.error("Error setting up Swagger:", error.message);
  }
};
