const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapSongsInPlaylistDBToModel } = require("../../utils/index");
const AuthorizationError = require("../../exceptions/AuthorizationsError");
const config = require("../../utils/config");
class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = "playlist-" + nanoid(16);
    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Tidak dapat menambah Playlist");
    }
    return result.rows[0].id;
  }

  async getPlaylist(userId) {
    const query = {
      text: `
      SELECT DISTINCT playlists.id, playlists.name, users.username
      FROM playlists
      JOIN users ON playlists.owner = users.id
      LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
    `,
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      // No playlists found for user
    }

    return result.rows;
  }

  async deletePlaylist(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
    return result.rows;
  }

  async addSongToPlaylist({ playlistId, songId, userId }) {
    const songQuery = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [songId],
    };

    const songResult = await this._pool.query(songQuery);
    if (!songResult.rowCount) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    const playlistSongId = `song-${nanoid(16)}`;
    const insertPlaylistSongQuery = {
      text: `INSERT INTO playlist_songs (id, playlist_id, song_id)
           VALUES ($1, $2, $3) RETURNING id`,
      values: [playlistSongId, playlistId, songId],
    };

    const playlistSongResult = await this._pool.query(insertPlaylistSongQuery);
    if (!playlistSongResult.rows.length) {
      throw new InvariantError("Lagu tidak dapat ditambahkan ke Playlist");
    }

    const activityId = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const insertActivityQuery = {
      text: `INSERT INTO playlist_song_activities 
            (id, playlist_id, song_id, user_id, action, time)
           VALUES ($1, $2, $3, $4, $5, $6)`,
      values: [activityId, playlistId, songId, userId, "add", time],
    };

    await this._pool.query(insertActivityQuery);

    return playlistSongResult.rows;
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

  async verifyPlaylistAccess({ playlistId, credentialId }) {
    const playlistQuery = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [playlistId],
    };

    const result = await this._pool.query(playlistQuery);

    if (!result.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];

    if (playlist.owner === credentialId) {
      return;
    }

    const collabQuery = {
      text: `
      SELECT * FROM collaborations
      WHERE playlist_id = $1 AND user_id = $2
    `,
      values: [playlistId, credentialId],
    };

    const collabResult = await this._pool.query(collabQuery);

    if (!collabResult.rowCount) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async getSongInPlaylist(id) {
    const query = {
      text: `
        SELECT 
          playlists.id AS playlist_id,
          playlists.name AS playlist_name,
          users.username AS owner_username,
          songs.id AS song_id,
          songs.title,
          songs.performer
        FROM playlists
        JOIN users ON playlists.owner = users.id
        LEFT JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id
        LEFT JOIN songs ON playlist_songs.song_id = songs.id
        WHERE playlists.id = $1;
    `,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = mapSongsInPlaylistDBToModel(result.rows);
    return playlist;
  }

  async deleteSongfromPlaylists({ playlistId, songId, userId }) {
    const deleteQuery = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };
    const deleteResult = await this._pool.query(deleteQuery);

    if (!deleteResult.rows.length) {
      throw new NotFoundError("Lagu di playlist tidak ditemukan");
    }

    const activityId = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();
    const activityQuery = {
      text: `
      INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
      values: [activityId, playlistId, songId, userId, "delete", time],
    };
    await this._pool.query(activityQuery);

    return deleteResult.rows;
  }
}
module.exports = PlaylistsService;
