const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationsError");
class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addColaborations({ playlistId, userId }) {
    const id = "collab-" + nanoid(16);
    const query = {
      text: `INSERT INTO collaborations (id, playlist_id, user_id) VALUES  ($1, $2, $3) RETURNING id`,
      values: [id, playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Collaborations gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async verifyPlaylistAccess({ playlistId, userId, credentialId }) {
    const playlistQuery = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [playlistId],
    };
    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = playlistResult.rows[0];

    if (playlist.owner !== credentialId) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }

    if (userId === credentialId && playlist.owner === credentialId) {
      throw new InvariantError(
        "Pemilik playlist tidak bisa menambahkan dirinya sendiri sebagai kolaborator"
      );
    }

    const usersQuery = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [userId],
    };
    const userResult = await this._pool.query(usersQuery);
    if (!userResult.rowCount) {
      throw new NotFoundError("User tidak ditemukan");
    }
  }

  async deleteCollaborations({ playlistId, userId }) {
    const query = {
      text: "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id",
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Lagu di playlist tidak ditemukan");
    }
    return result.rows;
  }
}

module.exports = CollaborationsService;
