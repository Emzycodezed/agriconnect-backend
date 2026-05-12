/**
 * Message Model
 * SMS and app messages between users
 */
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    recipient_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    direction: {
      type: DataTypes.ENUM('out', 'in'),
      allowNull: true,
      defaultValue: 'out'
    },
    channel: {
      type: DataTypes.ENUM('sms', 'voice', 'app'),
      allowNull: true,
      defaultValue: 'sms'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('queued', 'sent', 'failed'),
      allowNull: true,
      defaultValue: 'queued'
    },
    provider_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true
  });

  Message.associate = function(models) {
    Message.belongsTo(models.User, { foreignKey: 'user_id', as: 'sender' });
    Message.belongsTo(models.User, { foreignKey: 'recipient_id', as: 'recipient' });
  };

  return Message;
};
