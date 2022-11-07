'use strict'
require('dotenv').config()

exports.__esModule = true
exports.default = {
  APP_SECRET: process.env.APP_SECRET,
  PROJECT_DIR: __dirname,
  DOMAIN_MYSQL_TYPE: process.env.DOMAIN_MYSQL_TYPE,
  DOMAIN_MYSQL_HOST: process.env.DOMAIN_MYSQL_HOST,
  DOMAIN_MYSQL_PORT: process.env.DOMAIN_MYSQL_PORT,
  DOMAIN_MYSQL_DB: process.env.DOMAIN_MYSQL_DB,
  DOMAIN_MYSQL_USER: process.env.DOMAIN_MYSQL_USER,
  DOMAIN_MYSQL_PASSWORD: process.env.DOMAIN_MYSQL_PASSWORD,
  DOMAIN_MYSQL_SESSION_DB: process.env.DOMAIN_MYSQL_SESSION_DB,
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEYv,
  S3_BUCKET: process.env.S3_BUCKET,
  S3_DIRECTORY: process.env.S3_DIRECTORY
}
