const routes = require("./route");
const PlaylistActivitiesHandler = require("./handler");

module.exports = {
  name: "playlistActivities",
  version: "1.0.0",
  register: async (server, { service }) => {
    const handler = new PlaylistActivitiesHandler(service);
    server.route(routes(handler));
  },
};
