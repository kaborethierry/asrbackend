// src/models/admin.model.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const getUserByEmail = async (email) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Erreur getUserByEmail:', error);
    throw error;
  }
};

const verifyPassword = async (user, password) => {
  try {
    if (user.password && user.password.startsWith('$2')) {
      return bcrypt.compare(password, user.password);
    }
    return user.password === password;
  } catch (error) {
    console.error('Erreur verifyPassword:', error);
    return false;
  }
};

const getStats = async () => {
  try {
    const [pelerinages] = await db.query('SELECT COUNT(*) as total FROM pelerinages');
    const [inscriptionsEnAttente] = await db.query('SELECT COUNT(*) as total FROM inscriptions WHERE statut = "en_attente"');
    const [inscriptionsConfirmees] = await db.query('SELECT COUNT(*) as total FROM inscriptions WHERE statut = "confirmee"');
    // CORRECTION : La table s'appelle 'messages', pas 'contact_messages'
    const [messagesNonLus] = await db.query('SELECT COUNT(*) as total FROM messages WHERE lu = 0');

    return {
      total_pelerinages: pelerinages[0]?.total || 0,
      inscriptions_en_attente: inscriptionsEnAttente[0]?.total || 0,
      inscriptions_confirmees: inscriptionsConfirmees[0]?.total || 0,
      messages_non_lus: messagesNonLus[0]?.total || 0
    };
  } catch (error) {
    console.error('Erreur getStats:', error);
    return {
      total_pelerinages: 0,
      inscriptions_en_attente: 0,
      inscriptions_confirmees: 0,
      messages_non_lus: 0
    };
  }
};

const getDashboardData = async () => {
  try {
    // CORRECTION : Adapter les colonnes à ta table inscriptions
    const [inscriptionsRecentes] = await db.query(`
      SELECT 
        i.id, 
        i.nom, 
        i.prenom, 
        i.email, 
        i.telephone, 
        i.statut, 
        i.created_at,
        p.titre as pelerinage_titre
      FROM inscriptions i
      LEFT JOIN pelerinages p ON i.pelerinage_id = p.id
      ORDER BY i.created_at DESC
      LIMIT 5
    `);

    const [pelerinagesActifs] = await db.query(`
      SELECT id, titre, start_date, places_total, places_reservees
      FROM pelerinages
      WHERE status = 'actif' AND start_date > CURDATE()
      ORDER BY start_date ASC
    `);

    return {
      inscriptions_recentes: inscriptionsRecentes || [],
      pelerinages_actifs: pelerinagesActifs || []
    };
  } catch (error) {
    console.error('Erreur getDashboardData:', error);
    return {
      inscriptions_recentes: [],
      pelerinages_actifs: []
    };
  }
};

module.exports = { getUserByEmail, verifyPassword, getStats, getDashboardData };