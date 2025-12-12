// netlify/functions/create-reservation.ts
import { Handler } from '@netlify/functions';

const SHEET_ID = process.env.VITE_GOOGLE_SHEET_ID || '';
const API_KEY = process.env.VITE_GOOGLE_API_KEY || '';
const SHEET_NAME = 'Reservations';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { vehicleId, nom, email, dateDebut, dateFin, total } = body;

    // Validation
    if (!vehicleId || !nom || !email || !dateDebut || !dateFin || !total) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Générer un ID unique
    const id = Date.now().toString();
    const dateDemande = new Date().toISOString().split('T')[0];
    const statut = 'En attente';

    // Note: Pour écrire dans Google Sheets, vous aurez besoin d'un Service Account
    // Pour l'instant, on simule la création
    const reservation = {
      id,
      vehicleId,
      nom,
      email,
      dateDebut,
      dateFin,
      statut,
      dateDemande,
      total,
    };

    // TODO: Implémenter l'écriture dans Google Sheets avec Service Account
    console.log('Reservation to create:', reservation);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ 
        reservation,
        message: 'Reservation created successfully (simulated)'
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};