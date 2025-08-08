/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const up = (pgm) => {
  pgm.createTable("user_album_likes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    album_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });

  // Tambahkan foreign key ke tabel users
  pgm.addConstraint(
    "user_album_likes",
    "fk_user_album_likes.user_id_users.id",
    {
      foreignKeys: {
        columns: "user_id",
        references: "users(id)",
        onDelete: "CASCADE",
      },
    }
  );

  // Tambahkan foreign key ke tabel albums
  pgm.addConstraint(
    "user_album_likes",
    "fk_user_album_likes.album_id_albums.id",
    {
      foreignKeys: {
        columns: "album_id",
        references: "albums(id)",
        onDelete: "CASCADE",
      },
    }
  );

  // Supaya 1 user hanya bisa like 1 kali untuk album yang sama
  pgm.addConstraint("user_album_likes", "unique_user_album_like", {
    unique: ["user_id", "album_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropTable("user_album_likes");
};

module.exports = { up, down };
