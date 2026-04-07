// src/services/email.service.js
const { sendEmail } = require('../config/email');

const sendConfirmationEmail = async (user, inscription) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #C9A84C;">Agence Sainte Rita Voyages</h1>
      <h2>Confirmation de votre demande d'inscription</h2>
      <p>Bonjour <strong>${user.prenom} ${user.nom}</strong>,</p>
      <p>Nous avons bien reçu votre demande d'inscription pour le voyage :</p>
      <p><strong>${inscription.pelerinage_titre}</strong></p>
      <p>Référence de dossier : <strong>#${inscription.id}</strong></p>
      <p>Notre équipe vous contactera dans les 48 heures pour finaliser votre dossier.</p>
      <br>
      <p>Cordialement,</p>
      <p><strong>Agence Sainte Rita Voyages</strong></p>
      <p>Tel: +226 25 47 92 22 / +226 66 88 83 83</p>
      <p>Email: asritavoyages@gmail.com</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: `Confirmation d'inscription - ${inscription.pelerinage_titre}`,
    html
  });
};

const sendContactNotification = async (message) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #C9A84C;">Nouveau message de contact</h1>
      <p><strong>Nom:</strong> ${message.nom}</p>
      <p><strong>Email:</strong> ${message.email}</p>
      <p><strong>Téléphone:</strong> ${message.telephone || 'Non fourni'}</p>
      <p><strong>Sujet:</strong> ${message.sujet}</p>
      <p><strong>Message:</strong></p>
      <p>${message.message}</p>
    </div>
  `;

  return sendEmail({
    to: process.env.SMTP_USER || 'asritavoyages@gmail.com',
    subject: `Nouveau message - ${message.sujet}`,
    html
  });
};

module.exports = { sendConfirmationEmail, sendContactNotification };