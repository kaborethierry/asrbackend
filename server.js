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

// Configuration CORS complète et corrigée
const allowedOrigins = [
  'https://www.sainteritavoyages.com',
  'https://sainteritavoyages.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

// Ajouter l'URL du frontend depuis .env si présente
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// Middleware CORS avec fonction dynamique
app.use(cors({
  origin: function(origin, callback) {
    // Permettre les requêtes sans origin (curl, mobile, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Vérifier si l'origine est autorisée
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } 
    // Permettre les sous-domaines hostinger en développement/production
    else if (origin && origin.includes('hostingersite.com')) {
      callback(null, true);
    }
    // En production, on peut refuser les autres origines
    else if (process.env.NODE_ENV === 'production') {
      console.log(`❌ CORS bloqué pour: ${origin}`);
      callback(null, false);
    }
    // En développement, on accepte tout
    else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Helmet avec configuration moins restrictive pour CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Dossier statique pour les uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware pour logger les requêtes (debug CORS)
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url} - Origin: ${req.headers.origin || 'same-origin'}`);
  next();
});

// Routes API
app.use('/api', routes);

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Agence Sainte Rita Voyages - Bienvenue !',
    cors_origins: allowedOrigins,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route de health check pour Hostinger
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Route OPTIONS pour préflight CORS
app.options('*', cors());

// Gestionnaire d'erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur'
  });
});

// Démarrer le serveur (important pour Hostinger)
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📁 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ CORS autorisé pour les origines:`);
    allowedOrigins.forEach(origin => console.log(`   - ${origin}`));
    console.log(`   - *.hostingersite.com (sous-domaines)`);
    console.log(`\n🌐 API disponible sur: https://ghostwhite-ant-855293.hostingersite.com\n`);
  });
}

// Exporter pour Hostinger
module.exports = app;