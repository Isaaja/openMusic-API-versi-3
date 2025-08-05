const routes = require("./route");
const PlaylistsHandler = require("./handler");

module.exports = {
  name: "playlists",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const handler = new PlaylistsHandler(service, validator);
    server.route(routes(handler));
  },
};
