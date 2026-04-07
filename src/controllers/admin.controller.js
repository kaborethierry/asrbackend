// src/controllers/admin.controller.js
const adminModel = require('../models/admin.model');

const getStats = async (req, res) => {
  try {
    const stats = await adminModel.getStats();
    res.json({ success: true, ...stats });
  } catch (error) {
    console.error('Erreur getStats:', error);
    res.status(500).json({ success: false, message: 'Erreur lors du chargement des statistiques' });
  }
};

const getDashboard = async (req, res) => {
  try {
    const data = await adminModel.getDashboardData();
    res.json({ success: true, ...data });
  } catch (error) {
    console.error('Erreur getDashboard:', error);
    res.status(500).json({ success: false, message: 'Erreur lors du chargement du dashboard' });
  }
};

module.exports = { getStats, getDashboard };