// src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const adminController = require('../controllers/admin.controller');
const inscriptionController = require('../controllers/inscription.controller');
const contactController = require('../controllers/contact.controller');

// Dashboard et statistiques
router.get('/stats', authMiddleware, adminController.getStats);
router.get('/dashboard', authMiddleware, adminController.getDashboard);

// ==================== Gestion des inscriptions (admin) ====================
router.get('/inscriptions', authMiddleware, inscriptionController.getAll);
router.get('/inscriptions/:id', authMiddleware, inscriptionController.getById);
router.patch('/inscriptions/:id/status', authMiddleware, inscriptionController.updateStatus);
router.delete('/inscriptions/:id', authMiddleware, inscriptionController.remove);

// ==================== Gestion des messages (admin) ====================
router.get('/messages', authMiddleware, contactController.getAll);
router.get('/messages/:id', authMiddleware, contactController.getById);
router.patch('/messages/:id/read', authMiddleware, contactController.markAsRead);
router.delete('/messages/:id', authMiddleware, contactController.remove);

module.exports = router;