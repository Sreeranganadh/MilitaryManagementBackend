const pool = require('../models/db');
const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, '../logs/transactions.log');

const addPurchase = async (req, res) => {
  const { base_id, equipment_id, quantity } = req.body;

  try {
    await pool.query(
      'INSERT INTO purchases (base_id, equipment_id, quantity) VALUES ($1, $2, $3)',
      [base_id, equipment_id, quantity]
    );

    logAction(req.user, `Purchased ${quantity} of equipment ID ${equipment_id} for base ${base_id}`);
    res.status(201).json({ message: 'Purchase recorded' });
  } catch (err) {
    console.error('Add Purchase Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPurchases = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM purchases ORDER BY purchase_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Get Purchase Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

function logAction(user, action) {
  const entry = `${new Date().toISOString()} | ${user.username} (${user.role}) | ${action}\n`;
  fs.appendFileSync(logFile, entry);
}

module.exports = {
  addPurchase,
  getPurchases
};
