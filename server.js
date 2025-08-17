// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// const authRoutes = require('./routes/auth');
// const purchaseRoutes = require('./routes/purchases');
// const transferRoutes = require('./routes/transfers');
// const assignmentRoutes = require('./routes/assignments');
// const dashboardRoutes = require('./routes/dashboard');

// const app = express();

// app.use(cors());
// app.use(express.json());

// // API route handlers
// app.use('/api/auth', authRoutes);
// app.use('/api/purchases', purchaseRoutes);
// app.use('/api/transfers', transferRoutes);
// app.use('/api/assignments', assignmentRoutes);
// app.use('/api/dashboard', dashboardRoutes);

// // Serve React build files
// app.use(express.static(path.join(__dirname, '../frontend/build')));

// // Serve index.html for all other
// app.get('/*any', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`Server running and serving React app on port ${PORT}`)
// );
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const purchaseRoutes = require('./routes/purchases');
const transferRoutes = require('./routes/transfers');
const assignmentRoutes = require('./routes/assignments');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

const allowedOrigins = [
  'https://militarymanagementsys.netlify.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow non-browser requests like Postman or curl
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// API route handlers
app.use('/api/auth', authRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve React build files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all route for SPA support
app.get('/*any', (req, res) => {
   res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
 });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running and serving React app on port ${PORT}`)
);

