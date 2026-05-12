module.exports = (sequelize, DataTypes) => {
  return sequelize.define('BuyerProfile', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    nrc: { type: DataTypes.STRING(20), allowNull: false },
    province: DataTypes.STRING(100),
    district: DataTypes.STRING(100),
    ward: DataTypes.STRING(100),
    location: DataTypes.GEOMETRY('POINT'),
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'buyer_profiles', timestamps: false, underscored: true });
};
