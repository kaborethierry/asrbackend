const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// Route d'upload d'images (protégée par authentification admin)
router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun fichier uploadé' 
      });
    }

    // Construire l'URL de l'image
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/pelerinages/${req.file.filename}`;
    
    // Retourner l'URL de l'image
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

module.exports = router;