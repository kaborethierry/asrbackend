const { pool } = require('../config/db');

const getAll = async (params = {}) => {
  let query = `SELECT * FROM messages WHERE 1=1`;
  const values = [];

  if (params.lu !== undefined) {
    query += ` AND lu = ?`;
    values.push(params.lu === 'true' ? 1 : 0);
  }

  query += ` ORDER BY created_at DESC`;

  const [rows] = await pool.execute(query, values);
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM messages WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

const create = async (data) => {
  const [result] = await pool.execute(`
    INSERT INTO messages (nom, email, telephone, sujet, message)
    VALUES (?, ?, ?, ?, ?)
  `, [data.nom, data.email, data.telephone || null, data.sujet, data.message]);

  const [message] = await pool.execute('SELECT * FROM messages WHERE id = ?', [result.insertId]);
  return message[0];
};

const markAsRead = async (id) => {
  const [result] = await pool.execute(
    'UPDATE messages SET lu = 1 WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

const remove = async (id) => {
  const [result] = await pool.execute('DELETE FROM messages WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = { getAll, getById, create, markAsRead, remove };