/**
 * Supplier Model
 * Profile for agricultural input suppliers (seeds, fertilizer, equipment)
 */
module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define('Supplier', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    company_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    nrc: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bank_details: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    momo_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'supplier_profiles',
    timestamps: true,
    underscored: true
  });

  Supplier.associate = function(models) {
    Supplier.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Supplier;
};