import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Techkart API",
    description: "Techkart API documentation",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:8000/api/v1" }],
  components: {
    responses: {
      Success: {
        description: "Request was successful",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Success",
                },
              },
            },
          },
        },
      },
      Error: {
        description: "An error occurred",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  example: "Something went wrong",
                },
              },
            },
          },
        },
      },
    },
  },
};

const outputFile = "./test/swagger.json";
const endpointsFiles = [
  "./swaggerDoc.js", // ✅ Load the centralized file
  "./src/routes/test.routes.js", // ✅ Load all routes dynamically
];

// Generate Swagger JSON
swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
