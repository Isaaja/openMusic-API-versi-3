const autoBind = require("auto-bind");

class LikesHandler {
  constructor(service, albumsService) {
    this._service = service;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postAlbumLikesByIdHandler(request, h) {
    const { id: albumId } = request.params;
    await this._albumsService.getAlbumById(albumId);
    const { id: credentialId } = request.auth.credentials;
    await this._service.postLike({ albumId, owner: credentialId });
    const response = h.response({
      status: "success",
      message: "berhasil menyukai album",
    });
    response.code(201);
    return response;
  }
}

module.exports = LikesHandler;
