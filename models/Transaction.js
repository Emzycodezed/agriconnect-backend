module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL(10, 2),
    method: DataTypes.STRING(50),
    status: DataTypes.STRING(50),
    provider_ref: DataTypes.STRING(100),
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'transactions', timestamps: false, underscored: true });
};