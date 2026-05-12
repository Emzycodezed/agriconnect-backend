module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Advisory', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    content: DataTypes.TEXT,
    media_url: DataTypes.STRING(512),
    language: { type: DataTypes.STRING(20), defaultValue: 'nyanja' },
    crop_tag: DataTypes.STRING(50),
    severity: { type: DataTypes.ENUM('info', 'warning', 'critical'), defaultValue: 'info' },
    created_by: DataTypes.INTEGER,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'advisories', timestamps: false, underscored: true });
};