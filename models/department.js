module.exports = function(sequelize, DataTypes) {
  var Department = sequelize.define("Department", {
    text: DataTypes.STRING,
  });
  Department.associate = function(models) {
    // Associating Departments with Items
    // When an Departments is deleted, also delete any associated Items
    Department.hasMany(models.Item, {
    });
  };
  return Department;
};


