const { pool } = require('../config/db');

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
  
  const [urgence] = await pool.execute('SELECT nom, telephone FROM contact_urgence WHERE inscription_id = ?', [id]);
  if (urgence.length > 0) {
    rows[0].contact_urgence = urgence[0];
  }
  
  return rows[0];
};

const create = async (data) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(`
      INSERT INTO inscriptions (
        pelerinage_id, statut_professionnel, civilite, nom, prenom, date_naissance,
        lieu_naissance, nationalite, numero_passeport, date_expiration_passeport,
        email, telephone, adresse, profession, employeur, grand_pere_paternel,
        regime_alimentaire, remarques, prix_total, cgv_accepted, newsletter
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.pelerinage_id,
      data.statut_professionnel,
      data.civilite,
      data.nom,
      data.prenom,
      data.date_naissance,
      data.lieu_naissance || null,
      data.nationalite,
      data.numero_passeport || null,
      data.date_expiration_passeport || null,
      data.email,
      data.telephone,
      data.adresse,
      data.profession || null,
      data.employeur || null,
      data.grand_pere_paternel || null,
      data.regime_alimentaire,
      data.remarques || null,
      data.prix_total,
      data.cgv_accepted ? 1 : 0,
      data.newsletter ? 1 : 0
    ]);

    const inscriptionId = result.insertId;

    if (data.urgence_nom || data.urgence_tel) {
      await connection.execute(`
        INSERT INTO contact_urgence (inscription_id, nom, telephone) VALUES (?, ?, ?)
      `, [inscriptionId, data.urgence_nom || null, data.urgence_tel || null]);
    }

    await connection.commit();
    return getById(inscriptionId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
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