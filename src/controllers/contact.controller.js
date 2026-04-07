const contactModel = require('../models/contact.model');

const getAll = async (req, res) => {
  try {
    const { lu } = req.query;
    const messages = await contactModel.getAll({ lu });
    res.json(messages);
  } catch (error) {
    console.error('Erreur getAll messages:', error);
    res.status(500).json({ message: 'Erreur lors du chargement des messages' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await contactModel.getById(id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    
    res.json(message);
  } catch (error) {
    console.error('Erreur getById message:', error);
    res.status(500).json({ message: 'Erreur lors du chargement du message' });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const newMessage = await contactModel.create(data);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Erreur create message:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await contactModel.markAsRead(id);
    
    if (!updated) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    
    res.json({ success: true, message: 'Message marqué comme lu' });
  } catch (error) {
    console.error('Erreur markAsRead:', error);
    res.status(500).json({ message: 'Erreur lors du marquage' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await contactModel.remove(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    
    res.json({ success: true, message: 'Message supprimé' });
  } catch (error) {
    console.error('Erreur delete message:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};

module.exports = { getAll, getById, create, markAsRead, remove };