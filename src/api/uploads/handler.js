const autoBind = require("auto-bind");

class UploadsHandler {
  constructor(service, validator, albumsService) {
    this._service = service;
    this._validator = validator;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postUploadCoverImagesHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    await this._validator.validateImageHeaders(cover.hapi.headers);
    await this._validator.validateAlbumCover(
      cover.hapi.headers,
      cover._data ? cover._data.length : 0
    );
    await this._albumsService.getAlbumById(id);

    const filename = await this._service.writeFile(cover, cover.hapi);
    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
      data: {
        fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
