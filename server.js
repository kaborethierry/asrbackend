// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config();

const routes = require('./src/routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS - Autoriser tous les domaines en production
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL, 'https://sainteritavoyages.com', 'https://*.hostinger.com']
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Dossier statique pour les uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API
app.use('/api', routes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API Agence Sainte Rita Voyages - Bienvenue !' });
});

// Route de health check pour Hostinger
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Gestionnaire d'erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur'
  });
});

// Démarrer le serveur (important pour Hostinger)
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📁 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📁 Frontend autorisé: ${allowedOrigins.join(', ')}`);
  });
}

// Exporter pour Hostinger
module.exports = app;