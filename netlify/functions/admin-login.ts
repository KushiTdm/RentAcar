// netlify/functions/admin-login.ts
import { Handler } from '@netlify/functions';

const SHEET_ID = process.env.VITE_GOOGLE_SHEET_ID || '';
const API_KEY = process.env.VITE_GOOGLE_API_KEY || '';
const SHEET_NAME = 'Admins';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

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
    const { email, password } = body;

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email and password are required' }),
      };
    }

    // Récupérer les admins depuis Google Sheets
    const range = `${SHEET_NAME}!A2:C`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch admins from Google Sheets');
    }

    const data = await response.json();

    if (!data.values || data.values.length === 0) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    // Trouver l'admin
    const admin = data.values.find(
      (row: string[]) => row[0] === email && row[1] === password
    );

    if (!admin) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    // Créer un token simple (en production, utilisez JWT)
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        token,
        admin: {
          email: admin[0],
          nom: admin[2],
        },
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