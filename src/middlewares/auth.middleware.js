// src/middlewares/auth.middleware.js
const { verifyToken } = require('../utils/jwt.utils');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Non autorisé - Token manquant' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Non autorisé - Token invalide' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur auth middleware:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = authMiddleware;