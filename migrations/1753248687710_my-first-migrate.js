/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
const up = (pgm) => {
  pgm.createTable("albums", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "TEXT",
      notNull: true,
    },
    year: {
      type: "INT",
      notNull: true,
    },
  });

  pgm.createTable("songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "TEXT",
    },
    year: {
      type: "INT",
    },
    genre: {
      type: "TEXT",
    },
    performer: {
      type: "TEXT",
    },
    duration: {
      type: "INT",
    },
    albumId: {
      type: "VARCHAR(50)",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
const down = (pgm) => {
  pgm.dropTable("songs");
  pgm.dropTable("albums");
};

module.exports = {
  up,
  down,
};
