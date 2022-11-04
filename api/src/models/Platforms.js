const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("Platforms", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
