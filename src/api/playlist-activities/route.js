const routes = (handler) => [
  {
    method: "GET",
    path: "/playlists/{id}/activities",
    handler: handler.getPlaylistActivitiesByIdHandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
];

module.exports = routes;
