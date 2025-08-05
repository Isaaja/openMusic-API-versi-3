const Joi = require("joi");

const SongsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().max(2025).required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

const SongQuerySchema = Joi.object({
  title: Joi.string().optional(),
  performer: Joi.string().optional(),
});

module.exports = { SongsPayloadSchema, SongQuerySchema };
