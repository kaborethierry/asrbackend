const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const pelerinageRoutes = require('./pelerinage.routes');
const inscriptionRoutes = require('./inscription.routes');
const contactRoutes = require('./contact.routes');
const adminRoutes = require('./admin.routes');
const uploadRoutes = require('./upload.routes'); // ← Vérifiez que cette ligne existe

// Routes d'authentification (publiques)
router.use('/auth', authRoutes);

// Routes publiques
router.use('/pelerinages', pelerinageRoutes);
router.use('/inscriptions', inscriptionRoutes);
router.use('/contact', contactRoutes);

// Routes admin protégées
router.use('/admin', adminRoutes);

// Route d'upload
router.use('/', uploadRoutes); // ← ou router.use('/upload', uploadRoutes);

module.exports = router;