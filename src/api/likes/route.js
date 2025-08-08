const routes = (handler) => [
  {
    method: "POST",
    path: "/albums/{id}/likes",
    handler: handler.postAlbumLikesByIdHandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
];

module.exports = routes;
