/**
 * AuditLog Model
 * System audit trail for user actions
 */
module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
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
    action: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'audit_log',
    timestamps: false,
    underscored: true
  });

  AuditLog.associate = function(models) {
    AuditLog.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return AuditLog;
};
