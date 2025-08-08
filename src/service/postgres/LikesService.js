const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class LikesService {
  constructor() {
    this._pool = new Pool();
  }

  async postLike({ owner, albumId }) {
    try {
      const id = `like-${nanoid(16)}`;
      const query = {
        text: "INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id",
        values: [id, owner, albumId],
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
}

module.exports = LikesService;
