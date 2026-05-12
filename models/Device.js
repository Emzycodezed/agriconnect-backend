/**
 * Device Model
 * User device registration for push notifications
 */
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
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
    device_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    push_token: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    last_seen: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'devices',
    timestamps: false,
    underscored: true
  });

  Device.associate = function(models) {
    Device.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Device;
};
