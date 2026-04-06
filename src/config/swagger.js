import swaggerJsdoc from "swagger-jsdoc";
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
        url: "https://epremium-be.vercel.app",
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
            },
          },
        },
      },
    },
  },
  apis: [join(__dirname, "../routes/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  try {
    // Serve swagger spec as JSON
    app.get("/api/v1/docs/swagger.json", (req, res) => {
      res.type("application/json");
      res.send(swaggerSpec);
    });

    // Serve Swagger UI HTML using CDN
    app.get("/api/v1/docs", (req, res) => {
      res.type("text/html");
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>E-Premium API Documentation</title>
          <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui.css" />
          <style>
            html {
              box-sizing: border-box;
              overflow: -moz-scrollbars-vertical;
              overflow-y: scroll;
            }
            *, *:before, *:after {
              box-sizing: inherit;
            }
            body {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui-standalone-preset.js"></script>
          <script>
            window.onload = function() {
              window.ui = SwaggerUIBundle({
                url: "/api/v1/docs/swagger.json",
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIStandalonePreset
                ],
                plugins: [
                  SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
              });
            };
          </script>
        </body>
        </html>
      `);
    });

    console.log("Swagger Documentation available at /api/v1/docs");
  } catch (error) {
    console.error("Error setting up Swagger:", error.message);
  }
};
