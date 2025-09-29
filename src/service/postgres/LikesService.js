/*eslint no-unused-vars: 0*/
const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const config = require("../../utils/config");
class LikesService {
  constructor() {
    this._pool = new Pool();
    // this._cacheService = cacheService;
  }

  async postLike({ userId, albumId }) {
    try {
      const id = `like-${nanoid(16)}`;
      const query = {
        text: "INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id",
        values: [id, userId, albumId],
      };
      const result = await this._pool.query(query);
      // await this._cacheService.delete(`likes:${albumId}`);
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

    // await this._cacheService.delete(`likes:${albumId}`);
    return result.rows;
  }

  async getLike(albumId) {
    try {
      // const result = await this._cacheService.get(`likes:${albumId}`);
      return {
        likes: JSON.parse(result),
        // isCache: true,
      };
    } catch (error) {
      const result = await this._pool.query({
        text: "SELECT COUNT(*) AS likes FROM user_album_likes WHERE album_id = $1",
        values: [albumId],
      });

      const likes = parseInt(result.rows[0].likes, 10);

      // await this._cacheService.set(`likes:${albumId}`, JSON.stringify(likes));

      return { likes };
    }
  }
}

module.exports = LikesService;
