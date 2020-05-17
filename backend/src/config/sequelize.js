import 'dotenv/config';
import { config } from './config';
import { Sequelize, Model, DataTypes } from 'sequelize';


const con = config.dev;
const sequelize = 
new Sequelize(con.database, con.username, con.password, {
  host: con.host,
  dialect: 'postgres',
  storage: ':memory:',
});

export default {
  sequelize,
  Model,
  DataTypes,
}
