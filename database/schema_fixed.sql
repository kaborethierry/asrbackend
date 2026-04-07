-- ============================================
-- AGENCE SAINTE RITA VOYAGES
-- SCRIPT COMPATIBLE MARIA DB 10.4
-- ============================================

USE asr_voyages;

-- --------------------------------------------------
-- 1. SUPPRESSION DES TABLES (ordre inverse)
-- --------------------------------------------------
DROP TABLE IF EXISTS contact_urgence;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS inscriptions;
DROP TABLE IF EXISTS non_inclus_items;
DROP TABLE IF EXISTS inclus_items;
DROP TABLE IF EXISTS programme_jours;
DROP TABLE IF EXISTS pelerinages;
DROP TABLE IF EXISTS users;

-- --------------------------------------------------
-- 2. TABLE USERS
-- --------------------------------------------------
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------
-- 3. TABLE PELERINAGES
-- --------------------------------------------------
CREATE TABLE pelerinages (
  id VARCHAR(50) NOT NULL,
  titre VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  price INT NOT NULL,
  currency VARCHAR(10) DEFAULT 'FCFA',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  inscription_deadline DATE NOT NULL,
  description TEXT NOT NULL,
  long_description LONGTEXT,
  image VARCHAR(500) NOT NULL,
  gallery TEXT,
  month VARCHAR(20) NOT NULL,
  featured TINYINT(1) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'actif',
  places_total INT DEFAULT 30,
  places_reservees INT DEFAULT 0,
  prix_enfant INT DEFAULT NULL,
  conditions TEXT,
  documents_requis TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------
-- 4. TABLE PROGRAMME_JOURS
-- --------------------------------------------------
CREATE TABLE programme_jours (
  id INT NOT NULL AUTO_INCREMENT,
  pelerinage_id VARCHAR(50) NOT NULL,
  jour INT NOT NULL,
  titre VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  ordre INT DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (pelerinage_id) REFERENCES pelerinages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------
-- 5. TABLE INCLUS_ITEMS
-- --------------------------------------------------
CREATE TABLE inclus_items (
  id INT NOT NULL AUTO_INCREMENT,
  pelerinage_id VARCHAR(50) NOT NULL,
  item VARCHAR(255) NOT NULL,
  ordre INT DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (pelerinage_id) REFERENCES pelerinages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------
-- 6. TABLE NON_INCLUS_ITEMS
-- --------------------------------------------------
CREATE TABLE non_inclus_items (
  id INT NOT NULL AUTO_INCREMENT,
  pelerinage_id VARCHAR(50) NOT NULL,
  item VARCHAR(255) NOT NULL,
  ordre INT DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (pelerinage_id) REFERENCES pelerinages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------
-- 7. TABLE INSCRIPTIONS
-- --------------------------------------------------
CREATE TABLE inscriptions (
  id INT NOT NULL AUTO_INCREMENT,
  pelerinage_id VARCHAR(50) NOT NULL,
  statut_professionnel VARCHAR(50) NOT NULL,
  civilite VARCHAR(10) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  date_naissance DATE NOT NULL,
  lieu_naissance VARCHAR(255),
  nationalite VARCHAR(100) NOT NULL,
  numero_passeport VARCHAR(50),
  date_expiration_passeport DATE,
  email VARCHAR(255) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  adresse TEXT NOT NULL,
  profession VARCHAR(100),
  employeur VARCHAR(255),
  grand_pere_paternel VARCHAR(255),
  regime_alimentaire VARCHAR(50) DEFAULT 'standard',
  remarques TEXT,
  statut VARCHAR(20) DEFAULT 'en_attente',
  acompte INT DEFAULT 0,
  prix_total INT,
  newsletter TINYINT(1) DEFAULT 0,
  cgv_accepted TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (pelerinage_id) REFERENCES pelerinages(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------
-- 8. TABLE CONTACT_URGENCE
-- --------------------------------------------------
CREATE TABLE contact_urgence (
  id INT NOT NULL AUTO_INCREMENT,
  inscription_id INT NOT NULL,
  nom VARCHAR(255) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (inscription_id) REFERENCES inscriptions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------
-- 9. TABLE MESSAGES
-- --------------------------------------------------
CREATE TABLE messages (
  id INT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telephone VARCHAR(20),
  sujet VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  lu TINYINT(1) DEFAULT 0,
  repondu TINYINT(1) DEFAULT 0,
  reponse TEXT,
  repondu_le DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------
-- 10. INSERTION DES DONNÉES
-- --------------------------------------------------

-- 10.1 Admin (mot de passe: admin123)
INSERT INTO users (nom, prenom, email, password, role) VALUES 
('Tiendrebeogo', 'Iréné', 'admin@asr-voyages.bf', '$2a$10$zH4tX5qZ6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1g2h3i4j5k6l7m8n9o0p', 'super_admin');

-- 10.2 Voyages
INSERT INTO pelerinages (id, titre, location, country, duration, price, currency, start_date, end_date, inscription_deadline, description, image, month, featured, status) VALUES
('terre-sainte-jerusalem-paques-2026', 'Terre Sainte – Jérusalem (Spécial Pâques)', 'Israël', 'Israël', '13 jours / 12 nuits', 2000000, 'FCFA', '2026-03-27', '2026-04-08', '2026-02-28', 'Voyage en Terre Sainte permettant de marcher sur les traces du Christ. Spécial Pâques.', '/images/pelerinages/jerusalem.jpg', 'Mars', 1, 'actif');

INSERT INTO pelerinages (id, titre, location, country, duration, price, currency, start_date, end_date, inscription_deadline, description, image, month, featured, status) VALUES
('pologne-faustine-jean-paul-ii-2026', 'Pologne – Sur les pas de Sainte Faustine et Saint Jean-Paul II', 'Pologne', 'Pologne', '17 jours / 16 nuits', 2500000, 'FCFA', '2026-04-08', '2026-04-24', '2026-02-28', 'Voyage sur les pas de Sainte Faustine et de Saint Jean-Paul II.', '/images/pelerinages/pologne.jpg', 'Avril', 1, 'actif');

INSERT INTO pelerinages (id, titre, location, country, duration, price, currency, start_date, end_date, inscription_deadline, description, image, month, featured, status) VALUES
('grand-circuit-marial-europe-2026', 'Grand Circuit Marial en Europe', 'Multi-pays', 'Multi-pays', '17 jours / 16 nuits', 3000000, 'FCFA', '2026-05-04', '2026-05-20', '2026-03-30', 'Grand circuit marial en Europe.', '/images/pelerinages/marial-circuit.jpg', 'Mai', 1, 'actif');

INSERT INTO pelerinages (id, titre, location, country, duration, price, currency, start_date, end_date, inscription_deadline, description, image, month, featured, status) VALUES
('canada-montreal-quebec-2026', 'Canada – Montréal, Trois-Rivières et Québec', 'Canada', 'Canada', '17 jours / 16 nuits', 3700000, 'FCFA', '2026-08-30', '2026-09-15', '2026-02-05', 'Voyage au Canada.', '/images/pelerinages/canada.jpg', 'Août', 0, 'actif');

INSERT INTO pelerinages (id, titre, location, country, duration, price, currency, start_date, end_date, inscription_deadline, description, image, month, featured, status) VALUES
('assise-saint-francois-2026', 'Assise – Sur les pas de Saint François', 'Italie', 'Italie', '16 jours / 15 nuits', 2500000, 'FCFA', '2026-09-29', '2026-10-14', '2026-06-30', 'Voyage sur les pas de Saint François.', '/images/pelerinages/assise.jpg', 'Septembre', 0, 'actif');

-- 10.3 Programmes
INSERT INTO programme_jours (pelerinage_id, jour, titre, description, ordre) VALUES
('terre-sainte-jerusalem-paques-2026', 1, 'Départ', 'Vol vers Tel Aviv, accueil et transfert à Jérusalem', 1),
('terre-sainte-jerusalem-paques-2026', 2, 'Jérusalem - Mont des Oliviers', 'Visite du Mont des Oliviers, Gethsémani', 2),
('terre-sainte-jerusalem-paques-2026', 3, 'Jérusalem - Vieille Ville', 'Via Dolorosa, Saint-Sépulcre', 3),
('pologne-faustine-jean-paul-ii-2026', 1, 'Départ', 'Vol pour Cracovie', 1),
('pologne-faustine-jean-paul-ii-2026', 2, 'Cracovie', 'Visite de la vieille ville', 2);

-- 10.4 Inclus
INSERT INTO inclus_items (pelerinage_id, item) VALUES
('terre-sainte-jerusalem-paques-2026', 'Vols internationaux A/R'),
('terre-sainte-jerusalem-paques-2026', 'Hébergement en hôtels 3* et 4*'),
('terre-sainte-jerusalem-paques-2026', 'Pension complète'),
('terre-sainte-jerusalem-paques-2026', 'Accompagnement spirituel'),
('terre-sainte-jerusalem-paques-2026', 'Guide local francophone');

-- 10.5 Non inclus
INSERT INTO non_inclus_items (pelerinage_id, item) VALUES
('terre-sainte-jerusalem-paques-2026', 'Dépenses personnelles'),
('terre-sainte-jerusalem-paques-2026', 'Pourboires'),
('terre-sainte-jerusalem-paques-2026', 'Boissons pendant les repas'),
('terre-sainte-jerusalem-paques-2026', 'Visa (si nécessaire)');

SELECT '✅ Base de données créée avec succès !' AS message;
SELECT COUNT(*) AS total_voyages FROM pelerinages;
SELECT COUNT(*) AS total_programmes FROM programme_jours;
SELECT COUNT(*) AS total_inclus FROM inclus_items;
SELECT COUNT(*) AS total_non_inclus FROM non_inclus_items;