const pelerinageModel = require('../models/pelerinage.model');
const { slugify } = require('../utils/helpers');

const getAll = async (req, res) => {
  try {
    const { featured, status, limit } = req.query || {};
    const params = {};
    if (featured) params.featured = featured;
    if (status) params.status = status;
    if (limit) params.limit = limit;
    
    const pelerinages = await pelerinageModel.getAll(params);
    res.json(pelerinages);
  } catch (error) {
    console.error('Erreur getAll:', error);
    res.status(500).json({ message: 'Erreur lors du chargement des voyages' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'ID manquant' });
    }
    
    const pelerinage = await pelerinageModel.getById(id);
    
    if (!pelerinage) {
      return res.status(404).json({ message: 'Voyage non trouvé' });
    }
    
    // S'assurer que les champs JSON sont des tableaux
    if (!pelerinage.itinerary) pelerinage.itinerary = [];
    if (!pelerinage.inclus) pelerinage.inclus = [];
    if (!pelerinage.non_inclus) pelerinage.non_inclus = [];
    if (!pelerinage.gallery) pelerinage.gallery = [];
    
    res.json(pelerinage);
  } catch (error) {
    console.error('Erreur getById:', error);
    res.status(500).json({ message: 'Erreur lors du chargement du voyage' });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = slugify(data.titre);
    }
    const newPelerinage = await pelerinageModel.create(data);
    res.status(201).json(newPelerinage);
  } catch (error) {
    console.error('Erreur create:', error);
    res.status(500).json({ message: 'Erreur lors de la création du voyage' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const updated = await pelerinageModel.update(id, data);
    if (!updated) {
      return res.status(404).json({ message: 'Voyage non trouvé' });
    }
    
    res.json(updated);
  } catch (error) {
    console.error('Erreur update:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du voyage' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pelerinageModel.remove(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Voyage non trouvé' });
    }
    
    res.json({ success: true, message: 'Voyage supprimé avec succès' });
  } catch (error) {
    console.error('Erreur delete:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du voyage' });
  }
};

const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updated = await pelerinageModel.toggleStatus(id, status);
    if (!updated) {
      return res.status(404).json({ message: 'Voyage non trouvé' });
    }
    
    const updatedPelerinage = await pelerinageModel.getById(id);
    res.json(updatedPelerinage);
  } catch (error) {
    console.error('Erreur toggleStatus:', error);
    res.status(500).json({ message: 'Erreur lors du changement de statut' });
  }
};

module.exports = { getAll, getById, create, update, remove, toggleStatus };