const Joi = require("joi");
const MAX_FILE_SIZE = 512000;
const ImageHeadersSchema = Joi.object({
  "content-type": Joi.string()
    .valid(
      "image/apng",
      "image/avif",
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/webp"
    )
    .required(),
}).unknown();

const AlbumCoverMaxSizeSchema = Joi.object({
  headers: ImageHeadersSchema.required(),
  fileSize: Joi.number().max(MAX_FILE_SIZE).required(),
});

module.exports = { ImageHeadersSchema, AlbumCoverMaxSizeSchema };
