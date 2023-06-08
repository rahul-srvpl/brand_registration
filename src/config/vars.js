// import .env variables
require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo: {
    uri: process.env.MONGO_URI,
  },
  mysqlEnv: process.env.mysqlEnv,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  bs_region: process.env.bs_region,
  bs_secretAccessKey: process.env.bs_secretAccessKey,
  bs_accessKeyId: process.env.bs_accessKeyId,
  dwd_region: process.env.dwd_region,
  dwd_secretAccessKey: process.env.dwd_secretAccessKey,
  dwd_accessKeyId: process.env.dwd_accessKeyId,
  cloudinary_config: {
    cloudinary_name: process.env.CLOUDINARY_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET
  },
  jwt_config: {
    jwt_secret: process.env.JWT_SECRET,
    jwt_expiration: process.env.JWT_EXPIRATION,
    refresh_token_expiration: process.env.REFRESH_TOKEN_EXPIRATION,
    salt_rounds: process.env.SALT_ROUNDS
  },
  sendgrid: {
    sendgrid_api_key: process.env.SENDGRID_API_KEY,
    sendgrid_from_email: process.env.SENDGRID_FROM_EMAIL
  },
  google: {
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_callback_b2c: process.env.GOOGLE_CALLBACK_B2C,
    google_callback_b2b: process.env.GOOGLE_CALLBACK_B2B
  },
  facebook: {
    facebook_app_id: process.env.FACEBOOK_APP_ID,
    facebook_app_secret: process.env.FACEBOOK_APP_SECRET,
    facebook_callback: process.env.FACEBOOK_CALLBACK
  },
  client_url: process.env.CLIENT_URL,
  client_domain: process.env.CLIENT_DOMAIN
};
