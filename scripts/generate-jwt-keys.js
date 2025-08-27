#!/usr/bin/env node

const crypto = require("crypto");

console.log("🔐 Generating secure JWT keys for Railway deployment...\n");

// Generate access token key
const accessTokenKey = crypto.randomBytes(32).toString("hex");
console.log("ACCESS_TOKEN_KEY:");
console.log(accessTokenKey);
console.log("");

// Generate refresh token key
const refreshTokenKey = crypto.randomBytes(32).toString("hex");
console.log("REFRESH_TOKEN_KEY:");
console.log(refreshTokenKey);
console.log("");

console.log("📋 Copy these values to your Railway environment variables:");
console.log("");
console.log("ACCESS_TOKEN_KEY=" + accessTokenKey);
console.log("REFRESH_TOKEN_KEY=" + refreshTokenKey);
console.log("");
console.log(
  "⚠️  Keep these keys secure and never commit them to version control!"
);
