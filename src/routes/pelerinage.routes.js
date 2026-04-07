// src/routes/pelerinage.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const pelerinageController = require('../controllers/pelerinage.controller');

// Routes publiques
router.get('/', pelerinageController.getAll);
router.get('/:id', pelerinageController.getById);

// Routes protégées (admin)
router.post('/', authMiddleware, pelerinageController.create);
router.put('/:id', authMiddleware, pelerinageController.update);
router.delete('/:id', authMiddleware, pelerinageController.remove);
router.patch('/:id/status', authMiddleware, pelerinageController.toggleStatus);

module.exports = router;