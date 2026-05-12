/**
 * Complaint Model
 * User complaints and issues
 */
module.exports = (sequelize, DataTypes) => {
  const Complaint = sequelize.define('Complaint', {
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
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('pending', 'resolved'),
      allowNull: true,
      defaultValue: 'pending'
    },
    resolved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'complaints',
    timestamps: false,
    underscored: true
  });

  Complaint.associate = function(models) {
    Complaint.belongsTo(models.User, { foreignKey: 'user_id', as: 'complainant' });
    Complaint.belongsTo(models.User, { foreignKey: 'resolved_by', as: 'resolver' });
  };

  return Complaint;
};
