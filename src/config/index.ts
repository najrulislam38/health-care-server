import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  round_salt: process.env.ROUND_SALT,
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  },
  jwt: {
    accessToken_secret: process.env.ACCESS_TOKEN_SECRET,
    accessToken_expires: process.env.ACCESS_TOKEN_EXPIRES,
    refreshToken_secret: process.env.REFRESH_TOKEN_SECRET,
    refreshToken_expires: process.env.REFRESH_TOKEN_EXPIRES,
  },
  openRouter_api_key: process.env.OPENROUTER_API_KEY,
};
