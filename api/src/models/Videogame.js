const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("Videogame", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, //esto me genera automaticamente un id UUIDV4
      allowNull: false,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description_raw: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    released: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    rating: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },

    platforms: {
      //es un array porque son varias plataformas
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },

    background_image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "https://www.adslzone.net/app/uploads-adslzone.net/2020/05/Mejores-webs-con-juegos-multijugador.jpg"
    },

    createInDb: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });
};
