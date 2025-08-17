const pool= require('../models/db');
const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, '../logs/transactions.log');

const assignAsset = async (req, res) => {
  const { base_id, equipment_id, personnel_name, quantity } = req.body;

  try {
    await pool.query(
      'INSERT INTO assignments (base_id, equipment_id, personnel_name, quantity, status) VALUES ($1, $2, $3, $4, $5)',
      [base_id, equipment_id, personnel_name, quantity, 'assigned']
    );
    logAction(req.user, `Assigned ${quantity} of equipment ID ${equipment_id} to ${personnel_name}`);
    res.status(201).json({ message: 'Asset assigned' });
  } catch (err) {
    console.error('Assignment Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAssignments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM assignments ORDER BY assigned_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch Assignments Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const expendAsset = async (req, res) => {
  const { assignment_id } = req.body;

  try {
    await pool.query('UPDATE assignments SET status = $1 WHERE id = $2', ['expended', assignment_id]);
    logAction(req.user, `Marked assignment ID ${assignment_id} as expended`);
    res.status(200).json({ message: 'Asset marked as expended' });
  } catch (err) {
    console.error('Expend Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

function logAction(user, action) {
  const entry = `${new Date().toISOString()} | ${user.username} (${user.role}) | ${action}\n`;
  fs.appendFileSync(logFile, entry);
}

module.exports = { assignAsset, getAssignments, expendAsset };
