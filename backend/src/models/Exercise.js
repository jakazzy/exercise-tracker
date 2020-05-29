export default (sequelize, Model, DataTypes) => {
  class Exercise extends Model {}

  Exercise.init({
    description: DataTypes.TEXT,
    duration: DataTypes.INTEGER,
  }
  , {
    sequelize,
    modelName: 'Exercise',
  }
  );
 
  return Exercise
}


