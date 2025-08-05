const mapSongsInPlaylistDBToModel = (rows) => {
  const { playlist_id, playlist_name, owner_username } = rows[0];

  const songs = rows
    .filter((row) => row.song_id)
    .map((row) => ({
      id: row.song_id,
      title: row.title,
      performer: row.performer,
    }));

  return {
    id: playlist_id,
    name: playlist_name,
    username: owner_username,
    songs,
  };
};

module.exports = { mapSongsInPlaylistDBToModel };
