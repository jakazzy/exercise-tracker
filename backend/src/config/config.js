import 'dotenv/config';

export const config = {
  dev: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_PGDATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgress',
    jwt: {secret: process.env.MY_SECRET},
  },
};
