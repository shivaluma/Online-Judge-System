const sequelize = require('sequelize');
const { UUID } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const View = sequelize.define('View', {
    view: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  });

  View.associate = (models) => {
    View.belongsTo(models.Discuss, {
      onDelete: 'cascade',
      foreignKey: { name: 'discussId', allowNull: false },
    });
  };

  return View;
};
