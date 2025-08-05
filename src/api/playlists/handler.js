const autoBind = require("auto-bind");

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistsHandler(request, h) {
    this._validator.validatePostPlaylistsPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._service.addPlaylist({
      name,
      owner: credentialId,
    });
    const response = h.response({
      status: "success",
      data: {
        playlistId: playlistId,
      },
    });

    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylist(credentialId);
    return {
      status: "success",
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistsByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner({ playlistId, credentialId });

    await this._service.deletePlaylist(playlistId);
    return {
      status: "success",
      message: "Berhasil menghapus Playlist",
    };
  }

  async postSongToPlaylistsByIdHandler(request, h) {
    this._validator.validatePostSongToPlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this._service.verifyPlaylistAccess({ playlistId, credentialId });

    await this._service.addSongToPlaylist({
      playlistId,
      songId,
      userId: credentialId,
    });

    const response = h.response({
      status: "success",
      message: "Lagu berhasil ditambahkan ke playlist",
    });
    response.code(201);
    return response;
  }

  async getSongInPlaylistsByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess({
      playlistId: playlistId,
      credentialId: credentialId,
    });

    const playlist = await this._service.getSongInPlaylist(playlistId);
    return {
      status: "success",
      data: {
        playlist,
      },
    };
  }

  async deleteSongfromPlaylistsByIdHandler(request) {
    this._validator.validateDeleteSongFromPlaylistPayload(request.payload);
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._service.verifyPlaylistAccess({ playlistId, credentialId });

    await this._service.deleteSongfromPlaylists({
      playlistId,
      songId,
      userId: credentialId,
    });
    return {
      status: "success",
      message: "Lagu berhasil di hapus",
    };
  }
}

module.exports = PlaylistsHandler;
