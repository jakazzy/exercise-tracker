import 'dotenv/config';

export const config = {
  dev: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_PGDATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgress',
    jwt: {secret: process.env.MY_SECRET},
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
    facebookAppId: process.env.FACEBOOK_APP_ID,
    facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
    baseurl: process.env.BASE_URL,
  },
};
