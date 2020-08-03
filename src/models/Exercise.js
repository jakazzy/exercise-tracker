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
 
  Exercise.associate = function(models){
    Exercise.belongsTo(models.User)
  }
  
  return Exercise
}


