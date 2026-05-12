/**
 * Cooperative Model
 * Farmer cooperatives for bulk selling and resource sharing
 */
module.exports = (sequelize, DataTypes) => {
  const Cooperative = sequelize.define('Cooperative', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true
    },
    registration_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ward: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    established_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    member_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_land_hectares: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    primary_activities: {
      type: DataTypes.JSON,
      allowNull: true
    },
    contact_person: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    bank_account: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'cooperatives',
    timestamps: true,
    underscored: true
  });

  return Cooperative;
};