const up = (pgm) => {
  pgm.createTable("user_album_likes", {
    id: {
      type: "VARCHAR(100)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    album_id: {
      type: "VARCHAR(100)",
      notNull: true,
    },
  });

  // Foreign key ke tabel users
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

  // Foreign key ke tabel albums
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

  // Unik hanya pada kombinasi user_id + album_id
  pgm.addConstraint("user_album_likes", "unique_user_album_like", {
    unique: ["user_id", "album_id"],
  });
};

const down = (pgm) => {
  pgm.dropTable("user_album_likes");
};

module.exports = { up, down };
