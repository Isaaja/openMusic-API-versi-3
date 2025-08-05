const autoBind = require("auto-bind");

class CollaborationsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationsHandler(request, h) {
    this._validator.validateCollaborationsPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistAccess({
      playlistId,
      userId,
      credentialId,
    });
    const collaborationsId = await this._service.addColaborations({
      playlistId,
      userId,
    });
    const response = h.response({
      status: "success",
      data: {
        collaborationId: collaborationsId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationsHandler(request) {
    this._validator.validateCollaborationsPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistAccess({
      playlistId,
      userId,
      credentialId,
    });
    await this._service.deleteCollaborations({ playlistId, userId });
    return {
      status: "success",
      message: "Berhasil menghapus kolaborasi",
    };
  }
}

module.exports = CollaborationsHandler;
