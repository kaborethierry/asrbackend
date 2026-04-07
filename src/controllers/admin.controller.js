// src/controllers/admin.controller.js
const adminModel = require('../models/admin.model');

const getStats = async (req, res) => {
  try {
    const stats = await adminModel.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Erreur getStats:', error);
    res.status(500).json({ message: 'Erreur lors du chargement des statistiques' });
  }
};

const getDashboard = async (req, res) => {
  try {
    const data = await adminModel.getDashboardData();
    res.json(data);
  } catch (error) {
    console.error('Erreur getDashboard:', error);
    res.status(500).json({ message: 'Erreur lors du chargement du dashboard' });
  }
};

module.exports = { getStats, getDashboard };