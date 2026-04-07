# API Agence Sainte Rita Voyages

## Installation

1. Cloner le repository
2. `npm install`
3. Créer un fichier `.env` à partir de `.env.example`
4. Importer la base de données `database/schema.sql` et `database/seed.sql`
5. `npm run dev`

## Routes API

### Public
- `GET /api/pelerinages` - Liste des voyages
- `GET /api/pelerinages/:id` - Détail d'un voyage
- `POST /api/inscriptions` - Créer une inscription
- `POST /api/contact` - Envoyer un message

### Admin (authentification requise)
- `POST /api/admin/login` - Connexion
- `POST /api/admin/pelerinages` - Créer un voyage
- `PUT /api/admin/pelerinages/:id` - Modifier un voyage
- `DELETE /api/admin/pelerinages/:id` - Supprimer un voyage
- `GET /api/admin/inscriptions` - Liste des inscriptions
- `GET /api/admin/messages` - Liste des messages
- `GET /api/admin/stats` - Statistiques