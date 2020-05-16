import { Model, DataTypes } from 'sequelize';
import {sequelize} from '../../sequelize';
// import { User } from './../../users/models/User'

export class Exercise extends Model {}
Exercise.init({
  description: DataTypes.TEXT,
  duration: DataTypes.INTEGER,
}
, {
  sequelize,
  modelName: 'Exercise',
}
);

// User.hasMany(Exercise)
