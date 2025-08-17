const pool=require('../models/db');
const getDashboardStats=async (req,res) => {
  const baseId = req.user.base_id;
  try {
    const [purchases, transfersIn, transfersOut, assigned, expended] = await Promise.all([
      pool.query('SELECT COALESCE(SUM(quantity), 0) as total FROM purchases WHERE base_id = $1', [baseId]),
      pool.query('SELECT COALESCE(SUM(quantity), 0) as total FROM transfers WHERE to_base_id = $1', [baseId]),
      pool.query('SELECT COALESCE(SUM(quantity), 0) as total FROM transfers WHERE from_base_id = $1', [baseId]),
      pool.query("SELECT COALESCE(SUM(quantity), 0) as total FROM assignments WHERE base_id = $1 AND status = 'assigned'", [baseId]),
      pool.query("SELECT COALESCE(SUM(quantity), 0) as total FROM assignments WHERE base_id = $1 AND status = 'expended'", [baseId])
    ]);
    const openingBalance = 0; 
    const netMovement = parseInt(purchases.rows[0].total) + parseInt(transfersIn.rows[0].total) - parseInt(transfersOut.rows[0].total);
    const closingBalance = openingBalance + netMovement - parseInt(assigned.rows[0].total) - parseInt(expended.rows[0].total);

    res.json({
      opening_balance: openingBalance,
      net_movement: netMovement,
      closing_balance: closingBalance,
      assigned: parseInt(assigned.rows[0].total),
      expended: parseInt(expended.rows[0].total)
    });
  } catch (err) {
    console.error('Dashboard Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = { getDashboardStats };
