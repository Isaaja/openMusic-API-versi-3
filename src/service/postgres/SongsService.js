const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");
class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = "song-" + nanoid(16);
    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Tidak dapat menambahkan lagu");
    }
    return result.rows[0].id;
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }
    return result.rows[0];
  }

  async updateSongById(
    id,
    { title, year, genre, performer, duration, albumId }
  ) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "album_id" = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }
  }

  async getSongs({ title, performer }) {
    let baseQuery = "SELECT id, title, performer FROM songs";
    const values = [];
    const conditions = [];

    if (title) {
      values.push(`%${title.trim().toLowerCase()}%`);
      conditions.push(`LOWER(title) LIKE $${values.length}`);
    }

    if (performer) {
      values.push(`%${performer.trim().toLowerCase()}%`);
      conditions.push(`LOWER(performer) LIKE $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
    const finalQuery = {
      text: baseQuery + whereClause,
      values,
    };

    const result = await this._pool.query(finalQuery);
    return result.rows;
  }
}

module.exports = SongsService;
