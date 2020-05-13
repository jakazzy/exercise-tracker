import 'dotenv/config';
import { config } from './config/config';
import { Sequelize} from 'sequelize';

const con = config.dev;
export const sequelize = new Sequelize(con.database, con.username, con.password, {
  host: con.host,
  dialect: 'postgres',
  storage: ':memory:',
});
