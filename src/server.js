"use strict";

const Hapi = require("@hapi/hapi");
require("dotenv").config();
const Jwt = require("@hapi/jwt");

// albums
const albums = require("./api/albums");
const AlbumsService = require("./service/postgres/AlbumsService");
const AlbumsValidator = require("./validator/albums");

// songs
const songs = require("./api/songs");
const SongsService = require("./service/postgres/SongsService");
const SongsValidator = require("./validator/songs");

// users
const users = require("./api/users");
const UsersService = require("./service/postgres/UsersService");
const UsersValidator = require("./validator/users");

// authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./service/postgres/AuthenticationsService");
const AuthenticationsValidator = require("./validator/authentications");
const TokenManager = require("./tokenize/TokenManager");

// playlists
const playlists = require("./api/playlists");
const PlaylistsService = require("./service/postgres/PlaylistsService");
const PlaylistsValidator = require("./validator/playlists");

// collaborations
const collaborations = require("./api/collaborations");
const CollaborationsService = require("./service/postgres/CollaborationsService");
const CollaborationsValidator = require("./validator/collaborations");

// playlist activies
const playlistActivities = require("./api/playlist-activities");
const PlaylistsActivitiesService = require("./service/postgres/PlaylistActivitiesService");

// exceptions
const ClientError = require("./exceptions/ClientError");

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  const collaborationsService = new CollaborationsService();
  const playlistsActivitiesService = new PlaylistsActivitiesService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        usersService,
        tokenManager: TokenManager,
        authenticationsService,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        service: collaborationsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: playlistActivities,
      options: {
        service: playlistsActivitiesService,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (!response.isBoom) {
      return h.continue;
    }

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (response.isBoom && response.output.statusCode === 401) {
      return h
        .response({
          status: "fail",
          message: "Autentikasi diperlukan",
        })
        .code(401);
    }

    if (response.output?.statusCode === 404) {
      return h
        .response({
          status: "fail",
          message: "Halaman tidak ditemukan",
        })
        .code(404);
    }

    const newResponse = h.response({
      status: "error",
      message: "Terjadi kegagalan pada server kami.",
    });
    newResponse.code(500);
    console.error(response);
    return newResponse;
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
