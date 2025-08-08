const InvariantError = require("../../exceptions/InvariantError");
const PayloadTooLargeError = require("../../exceptions/PayloadTooLargeError");
const { ImageHeadersSchema, AlbumCoverMaxSizeSchema } = require("./schema");

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateAlbumCover(headers, fileSize) {
    const validationResult = AlbumCoverMaxSizeSchema.validate({
      headers,
      fileSize,
    });

    if (validationResult.error) {
      throw new PayloadTooLargeError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
