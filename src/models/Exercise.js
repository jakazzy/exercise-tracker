export default (sequelize, Model, DataTypes) => {
  class Exercise extends Model {}

  Exercise.init(
    {
      chartdata: DataTypes.ARRAY(DataTypes.JSON),
      progressdata: DataTypes.JSON,
      weeklylog: DataTypes.ARRAY(DataTypes.JSON),
      prevData: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      duration: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Exercise',
    }
  );

  Exercise.associate = function (models) {
    Exercise.belongsTo(models.User);
  };

  return Exercise;
};
