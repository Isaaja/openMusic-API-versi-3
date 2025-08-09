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
    const { id: userId } = request.auth.credentials;
    await this._service.postLike({ userId: userId, albumId });
    const response = h.response({
      status: "success",
      message: "berhasil menyukai album",
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikesByIdHandler(request) {
    const { id: albumId } = request.params;
    await this._albumsService.getAlbumById(albumId);
    const { id: userId } = request.auth.credentials;
    await this._service.deleteLike({ userId: userId, albumId });
    return {
      status: "success",
      message: "Berhasil menghapus Like",
    };
  }

  async getAlbumLikesByIdHandler(request, h) {
    const { id: albumId } = request.params;
    await this._albumsService.getAlbumById(albumId);

    const { likes, isCache } = await this._service.getLike(albumId);
    const response = h.response({
      status: "success",
      data: {
        likes: likes,
      },
    });
    if (isCache) {  
      response.header("X-Data-Source", "cache");
    }

    return response;
  }
}

module.exports = LikesHandler;
