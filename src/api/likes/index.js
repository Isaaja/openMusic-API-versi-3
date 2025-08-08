const routes = require("./route");
const LikesHandler = require("./handler");

module.exports = {
  name: "likes",
  version: "1.0.0",
  register: async (server, { service, albumsService }) => {
    const handler = new LikesHandler(service, albumsService);
    server.route(routes(handler));
  },
};
