const autoBind = require("auto-bind");

class PlaylistActivitiesHandler {
  constructor(service) {
    this._service = service;
    autoBind(this);
  }

  async getPlaylistActivitiesByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner({ playlistId, credentialId });

    const activities = await this._service.getPlaylistSongActivities(
      playlistId
    );

    return {
      status: "success",
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistActivitiesHandler;
