// src/controllers/inscription.controller.js
const inscriptionModel = require('../models/inscription.model');

const getAll = async (req, res) => {
  try {
    const { statut, pelerinage, search, limit } = req.query;
    console.log('📊 Récupération inscriptions - Filtres:', { statut, pelerinage, search, limit });
    
    const inscriptions = await inscriptionModel.getAll({ statut, pelerinage, search, limit });
    console.log(`✅ ${inscriptions.length} inscriptions trouvées`);
    
    res.json(inscriptions);
  } catch (error) {
    console.error('❌ Erreur getAll inscriptions:', error);
    res.status(500).json({ message: 'Erreur lors du chargement des inscriptions', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const inscription = await inscriptionModel.getById(id);
    
    if (!inscription) {
      return res.status(404).json({ message: 'Inscription non trouvée' });
    }
    
    res.json(inscription);
  } catch (error) {
    console.error('Erreur getById inscription:', error);
    res.status(500).json({ message: 'Erreur lors du chargement de l\'inscription' });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const newInscription = await inscriptionModel.create(data);
    res.status(201).json(newInscription);
  } catch (error) {
    console.error('❌ Erreur create inscription:', error);
    res.status(500).json({ message: error.message || 'Erreur lors de l\'inscription' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    
    const updated = await inscriptionModel.updateStatus(id, statut);
    if (!updated) {
      return res.status(404).json({ message: 'Inscription non trouvée' });
    }
    
    res.json({ success: true, message: 'Statut mis à jour' });
  } catch (error) {
    console.error('Erreur updateStatus:', error);
    res.status(500).json({ message: 'Erreur lors du changement de statut' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await inscriptionModel.remove(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Inscription non trouvée' });
    }
    
    res.json({ success: true, message: 'Inscription supprimée' });
  } catch (error) {
    console.error('Erreur delete inscription:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};

module.exports = { getAll, getById, create, updateStatus, remove };