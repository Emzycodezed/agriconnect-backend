module.exports = (sequelize, DataTypes) => {
  return sequelize.define('FarmerProfile', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    district: DataTypes.STRING(100),
    ward: DataTypes.STRING(100),
    farm_size_ha: DataTypes.DECIMAL(5, 2),
    crops: DataTypes.STRING(255),
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'farmer_profiles', timestamps: false, underscored: true });
};
