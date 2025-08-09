const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class LikesService {
  constructor() {
    this._pool = new Pool();
  }

  async postLike({ userId, albumId }) {
    try {
      const id = `like-${nanoid(16)}`;
      const query = {
        text: "INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id",
        values: [id, userId, albumId],
      };
      const result = await this._pool.query(query);
      return result.rows[0].id;
    } catch (error) {
      if (error.code === "23505") {
        throw new InvariantError("Anda sudah memberi like pada album ini");
      }
      throw error;
    }
  }

  async deleteLike({ userId, albumId }) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Like tidak ditemukan");
    }
    return result.rows;
  }

  async getLike(albumId) {
    const query = {
      text: "SELECT COUNT(*) AS likes FROM user_album_likes WHERE album_id = $1",
      values: [albumId],
    };
    const result = await this._pool.query(query);
    return parseInt(result.rows[0].likes, 10);
  }
}

module.exports = LikesService;
