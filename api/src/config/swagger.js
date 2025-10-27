import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Catalog API",
      version: "1.0.0",
      description: "Product catalog API documentation",
    },
    servers: [
      {
        url: process.env.SERVER_URL || "http://localhost:5000",
        description: "Local server",
      },
    ],
    tags: [
      {
        name: "Products",
        description: "Product management and catalog information",
      },
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          required: ["name", "code"], // price removed from required
          properties: {
            id: { type: "string", example: "671c5fd7a8e9a1bcd23fa11a" },
            name: { type: "string", example: "Bluetooth Headphones" },
            description: { type: "string", example: "Wireless earbuds with microphone" },
            price: { type: "number", example: 49.99 },
            category: {
              type: "array",
              items: { type: "string" },
              example: ["Electronics", "Accessories"],
            },
            image_url: {
              type: "string",
              example: "https://example.com/image.jpg",
            },
            brand: { type: "string", example: "Sony" },
            code: { type: "string", example: "ABC123" },
            stock: { type: "integer", example: 25 },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["audio", "wireless", "bluetooth"],
            },
            metadata: {
              type: "object",
              example: { color: "black", warranty: "2 years" },
            },
            createdAt: { type: "string", example: "2025-10-26T12:00:00Z" },
            updatedAt: { type: "string", example: "2025-10-26T12:00:00Z" },
          },
        },
      },
    },

    paths: {
      // Return the list of all products
      "/api/products": {
        get: {
          summary: "Get all products (with filters and search)",
          description: `
              Retrieve all products with optional filters.
              You can combine multiple filters (search, category, brand, code, tags).
          `,
          tags: ["Products"],
          parameters: [
            {
              name: "q",
              in: "query",
              description: "Search term (matches name, description, brand, code, or tags)",
              required: false,
              schema: { type: "string", example: "eco" },
            },
            {
              name: "category",
              in: "query",
              description: "Filter by category (can be multiple)",
              required: false,
              schema: {
                type: "array",
                items: { type: "string" },
                style: "form",
                explode: true,
                example: ["Electronics", "Accessories"],
              },
            },
            {
              name: "brand",
              in: "query",
              description: "Filter by brand (can be multiple)",
              required: false,
              schema: {
                type: "array",
                items: { type: "string" },
                style: "form",
                explode: true,
                example: ["Sony", "Samsung"],
              },
            },
            {
              name: "code",
              in: "query",
              description: "Filter by product code (can be multiple)",
              required: false,
              schema: {
                type: "array",
                items: { type: "string" },
                style: "form",
                explode: true,
                example: ["ABC123", "XYZ789"],
              },
            },
            {
              name: "tags",
              in: "query",
              description: "Filter by product tags (can be multiple)",
              required: false,
              schema: {
                type: "array",
                items: { type: "string" },
                style: "form",
                explode: true,
                example: ["eco", "bio", "wireless"],
              },
            },
          ],
          responses: {
            200: {
              description: "List of products matching filters",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
            500: { description: "Internal server error" },
          },
        },
        post: {
          summary: "Create a new product",
          tags: ["Products"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          responses: {
            201: { description: "Product created successfully" },
            400: { description: "Validation error" },
          },
        },
      },

      "/api/products/{id}": {
        get: {
          summary: "Get a product by ID",
          tags: ["Products"],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: { description: "Product found" },
            404: { description: "Product not found" },
          },
        },
        delete: {
          summary: "Delete a product by ID",
          tags: ["Products"],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: { description: "Product deleted" },
            404: { description: "Product not found" },
          },
        },
      },

      "/api/products/categories": {
        get: {
          summary: "Get all unique product categories",
          tags: ["Products"],
          responses: {
            200: {
              description: "Array of unique categories",
              content: {
                "application/json": { schema: { type: "array", items: { type: "string" } } },
              },
            },
          },
        },
      },

      "/api/products/count-by-category": {
        get: {
          summary: "Get the number of products per category",
          tags: ["Products"],
          responses: {
            200: {
              description: "Array with category name and product count",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        category: { type: "string", example: "Electronics" },
                        count: { type: "integer", example: 15 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      "/api/products/by-category/{category}": {
        get: {
          summary: "Get all products of a specific category",
          tags: ["Products"],
          parameters: [
            {
              name: "category",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Category name, e.g., 'Electronics'",
            },
          ],
          responses: {
            200: {
              description: "List of products in the category",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Product" } },
                },
              },
            },
          },
        },
      },

      "/api/products/brands": {
        get: {
          summary: "Get all unique brands",
          tags: ["Products"],
          responses: {
            200: {
              description: "Array of unique brands",
              content: {
                "application/json": { schema: { type: "array", items: { type: "string" } } },
              },
            },
          },
        },
      },

      "/api/products/codes": {
        get: {
          summary: "Get all product codes",
          tags: ["Products"],
          responses: {
            200: {
              description: "Array of unique product codes",
              content: {
                "application/json": { schema: { type: "array", items: { type: "string" } } },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
