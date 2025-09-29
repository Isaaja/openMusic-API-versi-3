/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
const up = (pgm) => {
  pgm.dropColumn("songs", "viva la vida");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
const down = (pgm) => {
  pgm.addColumn("songs", {
    "viva la vida": {
      type: "TEXT",
      notNull: false,
    },
  });
};

module.exports = { up, down };
