module.exports = (sequelize, DataTypes) => {
  const Discuss = sequelize.define('Discuss', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },

    authorUsername: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      field: 'author_username',
    },
    authorAvatar: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      field: 'author_avatar',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
  });
  Discuss.associate = (models) => {
    Discuss.belongsTo(models.User, { foreignKey: 'userId' });
    Discuss.belongsToMany(models.Tag, { through: 'Discuss_Tag' });
    Discuss.hasOne(models.View, {
      onDelete: 'cascade',
      foreignKey: 'discussId',
    });
    Discuss.hasMany(models.DiscussVote, {
      onDelete: 'cascade',
      foreignKey: 'discussId',
    });
    Discuss.hasMany(models.Comment, {
      onDelete: 'cascade',
      foreignKey: 'discussId',
    });

    Discuss.belongsTo(models.Problem, { foreignKey: 'problemId' });
  };

  return Discuss;
};
