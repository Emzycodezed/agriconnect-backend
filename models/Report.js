/**
 * Report Model
 * Extension officer reports
 */
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    extension_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    farmer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    report_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'responded'),
      allowNull: true,
      defaultValue: 'pending'
    },
    response_text: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'reports',
    timestamps: true,
    underscored: true
  });

  Report.associate = function(models) {
    Report.belongsTo(models.User, { foreignKey: 'extension_id', as: 'extension_officer' });
    Report.belongsTo(models.User, { foreignKey: 'farmer_id', as: 'farmer' });
  };

  return Report;
};
