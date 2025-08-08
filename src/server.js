"use strict";

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const config = require("./utils/config");
const path = require("path");
const Inert = require("@hapi/inert");

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

// Exports
const _exports = require("./api/exports");
const ProducerService = require("./service/rabbitmq/ProducerService");
const ExportsValidator = require("./validator/exports");

// uploads
const uploads = require("./api/uploads");
const StorageService = require("./service/storage/StorageService");
const UploadsValidator = require("./validator/uploads");

// likes
const likes = require("./api/likes");
const LikesService = require("./service/postgres/LikesService");
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
  const storageService = new StorageService(
    path.resolve(__dirname, "api/uploads/file/images")
  );
  const likesService = new LikesService();
  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
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
    {
      plugin: Inert,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: config.tokenManager.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.tokenManager.accessTokenAge,
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
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
        playlistsService: playlistsService,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
        albumsService: albumsService,
      },
    },
    {
      plugin: likes,
      options: {
        service: likesService,
        albumsService: albumsService,
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
