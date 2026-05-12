module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SupplierProfile', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    company_name: { type: DataTypes.STRING(150), allowNull: false },
    nrc: { type: DataTypes.STRING(20), allowNull: false },
    province: DataTypes.STRING(100),
    district: DataTypes.STRING(100),
    bank_details: DataTypes.STRING(255),
    momo_number: DataTypes.STRING(20),
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'supplier_profiles', timestamps: false, underscored: true });
};
