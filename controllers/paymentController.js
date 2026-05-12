const { Order, Payment } = require('../models');

exports.approvePayment = async (req, res) => {
  try {
    const { order_id, payment_method, status, transaction_ref } = req.body;
    const payment = await Payment.create({
      order_id,
      farmer_id: req.user.role === 'farmer' ? req.user.id : null,
      payment_method,
      status: status || 'pending',
      transaction_ref
    });
    await Order.update({ payment_status: status }, { where: { id: order_id } });
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    console.error("Payment error:", error.message);
    res.status(500).json({ success: false, message: "Payment approval failed" });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const { Payment } = require('../models');
    const where = req.user.role === 'farmer' ? { farmer_id: req.user.id } : {};
    const payments = await Payment.findAll({ where, order: [['created_at','DESC']], limit: 20 });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch payments" });
  }
};
