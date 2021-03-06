module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
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

    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
  });
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { foreignKey: 'userId' });
    Comment.belongsTo(models.Discuss, {
      onDelete: 'cascade',
      foreignKey: { name: 'discussId', allowNull: false },
    });
    Comment.hasMany(models.Comment, {
      onDelete: 'cascade',
      as: 'childs',
      foreignKey: { name: 'parentId' },
    });
    Comment.belongsTo(models.Comment, {
      onDelete: 'cascade',
      as: 'parent',
      foreignKey: { name: 'parentId' },
    });
  };

  return Comment;
};
