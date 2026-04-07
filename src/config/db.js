// src/config/db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'u583893350_voyages',
  password: process.env.DB_PASSWORD || 'SainteRita2026!',
  database: process.env.DB_NAME || 'u583893350_voyages_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

pool.getConnection()
  .then(connection => {
    console.log('✅ Connexion à la base de données établie');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Erreur de connexion BDD:', err.message);
  });

// EXPORTATION CORRIGÉE : exporter pool directement, pas { pool }
module.exports = pool;