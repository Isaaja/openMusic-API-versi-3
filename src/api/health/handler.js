class HealthHandler {
  constructor() {}

  async getHealthHandler(request, h) {
    return h.response({
      status: "success",
      message: "OpenMusic API is running",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
}

module.exports = HealthHandler;
