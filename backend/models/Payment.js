const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

// Verify sequelize instance is properly imported
console.log('Sequelize instance:', sequelize);

const Payment = sequelize.define('Payment', {
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  recipientAccountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  swiftCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Payment;
