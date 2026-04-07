// src/models/admin.model.js
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const getUserByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows.length > 0 ? rows[0] : null;
};

const verifyPassword = async (user, password) => {
  return bcrypt.compare(password, user.password);
};

const getStats = async () => {
  const [voyages] = await pool.execute('SELECT COUNT(*) as total FROM pelerinages');
  const [inscriptionsEnAttente] = await pool.execute(
    'SELECT COUNT(*) as total FROM inscriptions WHERE statut = "en_attente"'
  );
  const [inscriptionsConfirmees] = await pool.execute(
    'SELECT COUNT(*) as total FROM inscriptions WHERE statut = "confirmee"'
  );
  const [messagesNonLus] = await pool.execute(
    'SELECT COUNT(*) as total FROM messages WHERE lu = 0'
  );

  return {
    total_pelerinages: voyages[0].total,
    inscriptions_en_attente: inscriptionsEnAttente[0].total,
    inscriptions_confirmees: inscriptionsConfirmees[0].total,
    messages_non_lus: messagesNonLus[0].total
  };
};

const getDashboardData = async () => {
  const [inscriptionsRecentes] = await pool.execute(`
    SELECT i.*, p.titre as pelerinage_titre
    FROM inscriptions i
    LEFT JOIN pelerinages p ON i.pelerinage_id = p.id
    ORDER BY i.created_at DESC
    LIMIT 5
  `);

  const [voyagesActifs] = await pool.execute(`
    SELECT id, titre, start_date, places_total, places_reservees
    FROM pelerinages
    WHERE status = 'actif' AND start_date > CURDATE()
    ORDER BY start_date ASC
  `);

  return {
    inscriptions_recentes: inscriptionsRecentes,
    pelerinages_actifs: voyagesActifs
  };
};

module.exports = { getUserByEmail, verifyPassword, getStats, getDashboardData };