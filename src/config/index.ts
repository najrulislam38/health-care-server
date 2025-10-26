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
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_expires: process.env.ACCESS_TOKEN_EXPIRES,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires: process.env.REFRESH_TOKEN_EXPIRES,
    reset_token_secret: process.env.RESET_PASS_TOKEN,
    reset_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
  },
  reset_pass_link: process.env.RESET_PASS_LINK,
  openRouter_api_key: process.env.OPENROUTER_API_KEY,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  webhook_secret: process.env.WEB_HOOK_SECRET,
  emailSender: {
    email: process.env.APP_EMAIL,
    app_pass: process.env.APP_PASSWORD,
  },
};
