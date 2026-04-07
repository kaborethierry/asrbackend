// src/controllers/auth.controller.js
const { getUserByEmail, verifyPassword } = require('../models/admin.model');
const { generateToken } = require('../utils/jwt.utils');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }

    const isValid = await verifyPassword(user, password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la connexion' });
  }
};

module.exports = { login };