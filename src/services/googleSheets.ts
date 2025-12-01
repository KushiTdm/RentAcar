// src/services/googleSheets.ts
import { Vehicle } from '../types/vehicle';

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID || '';
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const SHEET_NAME = 'FlotteLocation';

export async function fetchVehicles(): Promise<Vehicle[]> {
  console.log('🔍 SHEET_ID:', SHEET_ID);
  console.log('🔍 API_KEY:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'undefined');
  
  if (!SHEET_ID || !API_KEY) {
    console.warn('❌ Google Sheets credentials not configured. Using mock data.');
    return getMockVehicles();
  }

  try {
    const range = `${SHEET_NAME}!A2:G`; // Récupère toutes les lignes depuis A2
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    
    console.log('🌐 Fetching from URL:', url);

    const response = await fetch(url);

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData);
      throw new Error('Failed to fetch vehicle data');
    }

    const data = await response.json();
    console.log('✅ Data received:', data);

    if (!data.values || data.values.length === 0) {
      console.warn('⚠️ No data in sheet, using mock data');
      return getMockVehicles();
    }

    const vehicles = data.values.map((row: string[]) => ({
      id: parseInt(row[0]),
      marque: row[1],
      modele: row[2],
      tarifJournalier: parseFloat(row[3]),
      statut: row[4] as 'Disponible' | 'Réservé',
      dateDebutReservation: row[5] || undefined,
      dateFinReservation: row[6] || undefined,
    }));

    console.log('🚗 Vehicles parsed:', vehicles);
    return vehicles;
  } catch (error) {
    console.error('💥 Error fetching vehicles from Google Sheets:', error);
    return getMockVehicles();
  }
}

export function isVehicleAvailable(
  vehicle: Vehicle,
  requestedStart: string,
  requestedEnd: string
): boolean {
  // Si le véhicule est disponible (pas de réservation en cours)
  if (vehicle.statut === 'Disponible') {
    return true;
  }

  // Si le véhicule est réservé mais sans dates, on considère qu'il n'est pas disponible
  if (!vehicle.dateDebutReservation || !vehicle.dateFinReservation) {
    return false;
  }

  // Vérifier si les dates demandées ne chevauchent pas la réservation existante
  const requestStart = new Date(requestedStart);
  const requestEnd = new Date(requestedEnd);
  const reservedStart = new Date(vehicle.dateDebutReservation);
  const reservedEnd = new Date(vehicle.dateFinReservation);

  // Le véhicule est disponible si :
  // - La demande se termine avant le début de la réservation existante
  // - OU la demande commence après la fin de la réservation existante
  return requestEnd < reservedStart || requestStart > reservedEnd;
}

function getMockVehicles(): Vehicle[] {
  console.log('📦 Returning mock vehicles');
  return [
    {
      id: 1,
      marque: 'Peugeot',
      modele: '208',
      tarifJournalier: 45,
      statut: 'Disponible',
    },
    {
      id: 2,
      marque: 'Renault',
      modele: 'Clio',
      tarifJournalier: 42,
      statut: 'Disponible',
    },
    {
      id: 3,
      marque: 'Citroën',
      modele: 'C3',
      tarifJournalier: 48,
      statut: 'Disponible',
    },
    {
      id: 4,
      marque: 'Volkswagen',
      modele: 'Golf',
      tarifJournalier: 55,
      statut: 'Disponible',
    },
    {
      id: 5,
      marque: 'Toyota',
      modele: 'Yaris',
      tarifJournalier: 50,
      statut: 'Disponible',
    },
  ];
}