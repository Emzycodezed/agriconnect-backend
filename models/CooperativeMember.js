/**
 * Cooperative Member Model
 * Junction table for farmer-cooperative relationships with roles
 */
module.exports = (sequelize, DataTypes) => {
  const CooperativeMember = sequelize.define('CooperativeMember', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    cooperative_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'cooperatives',
        key: 'id'
      }
    },
    farmer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'farmers',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.ENUM('member', 'chairperson', 'secretary', 'treasurer', 'committee'),
      defaultValue: 'member'
    },
    join_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'left'),
      defaultValue: 'active'
    },
    shares: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    loan_eligibility: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    }
  }, {
    tableName: 'cooperative_members',
    timestamps: true,
    underscored: true
  });

  return CooperativeMember;
};