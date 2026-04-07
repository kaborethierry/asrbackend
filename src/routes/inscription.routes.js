// src/routes/inscription.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const inscriptionController = require('../controllers/inscription.controller');

// Route publique - Créer une inscription (POST)
router.post('/', inscriptionController.create);

// Routes protégées (admin) - Toutes nécessitent authentification
router.get('/', authMiddleware, inscriptionController.getAll);
router.get('/:id', authMiddleware, inscriptionController.getById);
router.patch('/:id/status', authMiddleware, inscriptionController.updateStatus);
router.delete('/:id', authMiddleware, inscriptionController.remove);

module.exports = router;