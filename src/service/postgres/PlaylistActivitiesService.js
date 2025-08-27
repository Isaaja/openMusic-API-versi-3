const { Pool } = require("pg");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationsError");
const config = require("../../utils/config");
class PlaylistActivitiesService {
  constructor() {
    this._pool = new Pool({
      connectionString: config.postgres.databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  async getPlaylistSongActivities(playlistId) {
    const query = {
      text: `
      SELECT 
        users.username,
        songs.title,
        playlist_song_activities.action,
        playlist_song_activities.time
      FROM playlist_song_activities
      JOIN users ON users.id = playlist_song_activities.user_id
      JOIN songs ON songs.id = playlist_song_activities.song_id
      WHERE playlist_song_activities.playlist_id = $1
      ORDER BY playlist_song_activities.time ASC;
    `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyPlaylistOwner({ playlistId, credentialId }) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];

    if (playlist.owner !== credentialId) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }
}

module.exports = PlaylistActivitiesService;
