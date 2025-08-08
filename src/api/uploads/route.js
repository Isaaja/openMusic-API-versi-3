const routes = (handler) => [
  {
    method: "POST",
    path: "/albums/{id}/covers",
    handler: handler.postUploadCoverImagesHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
      },
    },
  },
];

module.exports = routes;
