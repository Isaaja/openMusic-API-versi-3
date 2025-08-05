const routes = require("./route");
const CollaborationsHandler = require("./handler");

module.exports = {
  name: "collaborations",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const handler = new CollaborationsHandler(service, validator);
    server.route(routes(handler));
  },
};
