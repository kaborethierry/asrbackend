const { pool } = require('../config/db');

const getAll = async (params = {}) => {
  let query = `SELECT * FROM pelerinages WHERE 1=1`;
  const values = [];

  if (params.featured === 'true') {
    query += ` AND featured = 1`;
  }
  if (params.status) {
    query += ` AND status = ?`;
    values.push(params.status);
  }
  if (params.limit) {
    query += ` LIMIT ?`;
    values.push(parseInt(params.limit));
  }

  query += ` ORDER BY start_date ASC`;

  const [rows] = await pool.execute(query, values);
  
  // Formater les données JSON
  return rows.map(row => {
    // Gallery
    if (row.gallery && typeof row.gallery === 'string') {
      try {
        row.gallery = JSON.parse(row.gallery);
      } catch (e) {
        row.gallery = [];
      }
    } else if (!row.gallery) {
      row.gallery = [];
    }
    
    // Itinerary
    if (row.itinerary && typeof row.itinerary === 'string') {
      try {
        row.itinerary = JSON.parse(row.itinerary);
      } catch (e) {
        row.itinerary = [];
      }
    } else if (!row.itinerary) {
      row.itinerary = [];
    }
    
    // Inclus
    if (row.inclus && typeof row.inclus === 'string') {
      try {
        row.inclus = JSON.parse(row.inclus);
      } catch (e) {
        row.inclus = [];
      }
    } else if (!row.inclus) {
      row.inclus = [];
    }
    
    // Non inclus
    if (row.non_inclus && typeof row.non_inclus === 'string') {
      try {
        row.non_inclus = JSON.parse(row.non_inclus);
      } catch (e) {
        row.non_inclus = [];
      }
    } else if (!row.non_inclus) {
      row.non_inclus = [];
    }
    
    return row;
  });
};

const getById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM pelerinages WHERE id = ?', [id]);
  if (rows.length > 0) {
    const row = rows[0];
    
    // Gallery
    if (row.gallery && typeof row.gallery === 'string') {
      try {
        row.gallery = JSON.parse(row.gallery);
      } catch (e) {
        row.gallery = [];
      }
    } else if (!row.gallery) {
      row.gallery = [];
    }
    
    // Itinerary
    if (row.itinerary && typeof row.itinerary === 'string') {
      try {
        row.itinerary = JSON.parse(row.itinerary);
      } catch (e) {
        row.itinerary = [];
      }
    } else if (!row.itinerary) {
      row.itinerary = [];
    }
    
    // Inclus
    if (row.inclus && typeof row.inclus === 'string') {
      try {
        row.inclus = JSON.parse(row.inclus);
      } catch (e) {
        row.inclus = [];
      }
    } else if (!row.inclus) {
      row.inclus = [];
    }
    
    // Non inclus
    if (row.non_inclus && typeof row.non_inclus === 'string') {
      try {
        row.non_inclus = JSON.parse(row.non_inclus);
      } catch (e) {
        row.non_inclus = [];
      }
    } else if (!row.non_inclus) {
      row.non_inclus = [];
    }
    
    return row;
  }
  return null;
};

const create = async (data) => {
  const { id, titre, location, country, duration, price, currency, start_date, end_date,
          inscription_deadline, description, long_description, image, gallery, month,
          featured, status, places_total, places_reservees, prix_enfant, conditions, 
          documents_requis, itinerary, inclus, non_inclus } = data;

  // Formater les JSON pour MySQL
  const galleryStr = gallery ? (typeof gallery === 'string' ? gallery : JSON.stringify(gallery)) : '[]';
  const itineraryStr = itinerary ? (typeof itinerary === 'string' ? itinerary : JSON.stringify(itinerary)) : '[]';
  const inclusStr = inclus ? (typeof inclus === 'string' ? inclus : JSON.stringify(inclus)) : '[]';
  const nonInclusStr = non_inclus ? (typeof non_inclus === 'string' ? non_inclus : JSON.stringify(non_inclus)) : '[]';

  const [result] = await pool.execute(`
    INSERT INTO pelerinages (
      id, titre, location, country, duration, price, currency,
      start_date, end_date, inscription_deadline, description, long_description,
      image, gallery, month, featured, status, places_total, places_reservees,
      prix_enfant, conditions, documents_requis, itinerary, inclus, non_inclus
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, titre, location, country, duration, price, currency, start_date, end_date,
      inscription_deadline, description, long_description, image, galleryStr,
      month, featured ? 1 : 0, status, places_total, places_reservees, prix_enfant,
      conditions, documents_requis, itineraryStr, inclusStr, nonInclusStr]);

  return getById(id);
};

const update = async (id, data) => {
  const fields = [];
  const values = [];

  const allowedFields = ['titre', 'location', 'country', 'duration', 'price', 'currency',
    'start_date', 'end_date', 'inscription_deadline', 'description', 'long_description',
    'image', 'gallery', 'month', 'featured', 'status', 'places_total', 'places_reservees',
    'prix_enfant', 'conditions', 'documents_requis', 'itinerary', 'inclus', 'non_inclus'];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      fields.push(`${field} = ?`);
      let value = data[field];
      
      if (field === 'featured') {
        value = value ? 1 : 0;
      } else if (field === 'gallery' || field === 'itinerary' || field === 'inclus' || field === 'non_inclus') {
        if (value && typeof value !== 'string') {
          value = JSON.stringify(value);
        } else if (!value) {
          value = '[]';
        }
      }
      
      values.push(value);
    }
  }

  if (fields.length > 0) {
    values.push(id);
    await pool.execute(`UPDATE pelerinages SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  return getById(id);
};

const remove = async (id) => {
  const [result] = await pool.execute('DELETE FROM pelerinages WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

const toggleStatus = async (id, status) => {
  const [result] = await pool.execute(
    'UPDATE pelerinages SET status = ? WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  toggleStatus
};