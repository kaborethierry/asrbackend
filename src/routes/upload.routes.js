const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// Route d'upload d'images (protégée par authentification admin)
router.post('/upload', authMiddleware, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Erreur multer:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Erreur lors de l\'upload'
      });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Aucun fichier uploadé'
        });
      }

      // URL absolue vers l'image (HTTPS)
      const imageUrl = `https://ghostwhite-ant-855293.hostingersite.com/uploads/pelerinages/${req.file.filename}`;
      
      res.json({
        success: true,
        url: imageUrl,
        filename: req.file.filename,
        message: 'Image uploadée avec succès'
      });
    } catch (error) {
      console.error('Erreur upload:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'upload de l\'image'
      });
    }
  });
});

module.exports = router;