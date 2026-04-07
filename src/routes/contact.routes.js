const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const contactController = require('../controllers/contact.controller');

// Route publique
router.post('/', contactController.create);

// Routes protégées (admin)
router.get('/', authMiddleware, contactController.getAll);
router.get('/:id', authMiddleware, contactController.getById);
router.patch('/:id/read', authMiddleware, contactController.markAsRead);
router.delete('/:id', authMiddleware, contactController.remove);

module.exports = router;