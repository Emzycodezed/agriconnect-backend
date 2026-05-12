/**
 * Admin Log Model
 * Audit trail for admin actions
 */
module.exports = (sequelize, DataTypes) => {
  const AdminLog = sequelize.define('AdminLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    admin_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'e.g., user_approved, price_updated, etc.'
    },
    entity_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'user, crop, transaction, etc.'
    },
    entity_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    old_values: {
      type: DataTypes.JSON,
      allowNull: true
    },
    new_values: {
      type: DataTypes.JSON,
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'admin_logs',
    timestamps: true,
    underscored: true
  });

  return AdminLog;
};