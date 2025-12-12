// netlify/functions/get-reservations.ts
import { Handler } from '@netlify/functions';

const SHEET_ID = process.env.VITE_GOOGLE_SHEET_ID || '';
const API_KEY = process.env.VITE_GOOGLE_API_KEY || '';
const SHEET_NAME = 'Reservations';

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const range = `${SHEET_NAME}!A2:I`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch reservations from Google Sheets');
    }

    const data = await response.json();

    if (!data.values || data.values.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ reservations: [] }),
      };
    }

    const reservations = data.values.map((row: string[]) => ({
      id: row[0],
      vehicleId: parseInt(row[1]),
      nom: row[2],
      email: row[3],
      dateDebut: row[4],
      dateFin: row[5],
      statut: row[6],
      dateDemande: row[7],
      total: parseFloat(row[8]),
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reservations }),
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