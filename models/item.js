module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define("Item", {
    item: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    },
    imgUrl: DataTypes.TEXT
  });
  Item.associate = function(models) {
    // We're saying that a Item should belong to an Departments
    // A Item can't be created without an Departments due to the foreign key constraint
    Item.belongsTo(models.Department, models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    // Item.belongsTo(models.User, {
    //   foreignKey: {
    //     allowNull: false
    //   }
    // })
  };
  return Item;
}; 

