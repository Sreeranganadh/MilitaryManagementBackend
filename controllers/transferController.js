const pool = require('../models/db');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/transactions.log');

const addTransfer = async (req, res) => {
  const { equipment_id, from_base_id, to_base_id, quantity } = req.body;

  try {
    await pool.query(
      'INSERT INTO transfers (equipment_id, from_base_id, to_base_id, quantity) VALUES ($1, $2, $3, $4)',
      [equipment_id, from_base_id, to_base_id, quantity]
    );

    logAction(req.user, `Transferred ${quantity} of equipment ID ${equipment_id} from base ${from_base_id} to base ${to_base_id}`);
    res.status(201).json({ message: 'Transfer recorded' });
  } catch (err) {
    console.error('Add Transfer Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getTransfers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transfers ORDER BY transfer_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Get Transfers Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

function logAction(user, action) {
  const entry = `${new Date().toISOString()} | ${user.username} (${user.role}) | ${action}\n`;
  fs.appendFileSync(logFile, entry);
}

module.exports = { addTransfer, getTransfers };
