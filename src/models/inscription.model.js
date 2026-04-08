// src/models/inscription.model.js
const pool = require('../config/db');  // ← CORRECTION : sans les {}

const getAll = async (params = {}) => {
  let query = `
    SELECT i.*, p.titre as pelerinage_titre
    FROM inscriptions i
    LEFT JOIN pelerinages p ON i.pelerinage_id = p.id
    WHERE 1=1
  `;
  const values = [];

  if (params.statut && params.statut !== 'tous') {
    query += ` AND i.statut = ?`;
    values.push(params.statut);
  }
  if (params.pelerinage && params.pelerinage !== 'tous') {
    query += ` AND i.pelerinage_id = ?`;
    values.push(params.pelerinage);
  }
  if (params.search) {
    query += ` AND (i.nom LIKE ? OR i.prenom LIKE ? OR i.email LIKE ? OR i.telephone LIKE ?)`;
    const search = `%${params.search}%`;
    values.push(search, search, search, search);
  }
  if (params.limit) {
    query += ` LIMIT ?`;
    values.push(parseInt(params.limit));
  }

  query += ` ORDER BY i.created_at DESC`;

  const [rows] = await pool.execute(query, values);
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.execute(`
    SELECT i.*, p.titre as pelerinage_titre
    FROM inscriptions i
    LEFT JOIN pelerinages p ON i.pelerinage_id = p.id
    WHERE i.id = ?
  `, [id]);

  if (rows.length === 0) return null;
  return rows[0];
};

const create = async (data) => {
  const [result] = await pool.execute(`
    INSERT INTO inscriptions (
      pelerinage_id, nom, prenom, email, telephone, statut
    ) VALUES (?, ?, ?, ?, ?, ?)
  `, [
    data.pelerinage_id,
    data.nom,
    data.prenom || null,
    data.email,
    data.telephone,
    'en_attente'
  ]);

  return getById(result.insertId);
};

const updateStatus = async (id, statut) => {
  const [result] = await pool.execute(
    'UPDATE inscriptions SET statut = ? WHERE id = ?',
    [statut, id]
  );
  return result.affectedRows > 0;
};

const remove = async (id) => {
  const [result] = await pool.execute('DELETE FROM inscriptions WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = { getAll, getById, create, updateStatus, remove };