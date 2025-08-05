const { SongQuerySchema } = require("../../validator/songs");

const routes = (handler) => [
  {
    method: "POST",
    path: "/songs",
    handler: handler.postSongHandler,
  },
  {
    method: "GET",
    path: "/songs",
    handler: handler.getSongsHandler,
    options: {
      validate: {
        query: SongQuerySchema,
      },
    },
  },
  {
    method: "GET",
    path: "/songs/{id}",
    handler: handler.getSongByIdHandler,
  },
  {
    method: "PUT",
    path: "/songs/{id}",
    handler: handler.putSongByIdHandler,
  },
  {
    method: "DELETE",
    path: "/songs/{id}",
    handler: handler.deleteSongByIdHandler,
  },
];

module.exports = routes;
