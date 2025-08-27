const HealthHandler = require("./handler");

const health = {
  name: "health",
  version: "1.0.0",
  register: async (server, options) => {
    const healthHandler = new HealthHandler();

    server.route([
      {
        method: "GET",
        path: "/health",
        handler: healthHandler.getHealthHandler,
        options: {
          description: "Health check endpoint",
          tags: ["health"],
          response: {
            schema: {
              type: "object",
              properties: {
                status: { type: "string" },
                message: { type: "string" },
                timestamp: { type: "string" },
                uptime: { type: "number" },
              },
            },
          },
        },
      },
    ]);
  },
};

module.exports = health;
