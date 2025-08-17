const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, '../logs/transactions.log');

const logAction = (user, action) => {
  const log = `${new Date().toISOString()} | ${user.username} (${user.role}) | ${action}\n`;
  fs.appendFileSync(logFile, log);
};

module.exports = logAction;
