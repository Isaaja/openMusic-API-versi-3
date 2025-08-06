/*eslint no-unused-vars: */

const Jwt = require("@hapi/jwt");
const InvariantError = require("../exceptions/InvariantError");
const config = require("../utils/config");
require("dotenv").config();

const TokenManager = {
  generateAccessToken: (payload) =>
    Jwt.token.generate(payload, config.tokenManager.accessTokenKey),
  generateRefreshToken: (payload) =>
    Jwt.token.generate(payload, config.tokenManager.refreshTokenKey),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, config.tokenManager.refreshTokenKey);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError("Refresh token tidak valid");
    }
  },
};

module.exports = TokenManager;
