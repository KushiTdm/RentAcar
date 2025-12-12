// src/services/reservations.ts
import { Reservation, CreateReservationDTO, UpdateReservationStatusDTO } from '../types/reservation';

const API_BASE = '/.netlify/functions';

export async function fetchReservations(): Promise<Reservation[]> {
  try {
    const response = await fetch(`${API_BASE}/get-reservations`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch reservations');
    }
    
    const data = await response.json();
    return data.reservations || [];
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return getMockReservations();
  }
}

export async function createReservation(reservation: CreateReservationDTO): Promise<Reservation> {
  try {
    const response = await fetch(`${API_BASE}/create-reservation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservation),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create reservation');
    }
    
    const data = await response.json();
    return data.reservation;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
}

export async function updateReservationStatus(
  update: UpdateReservationStatusDTO
): Promise<Reservation> {
  try {
    const response = await fetch(`${API_BASE}/update-reservation`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update reservation');
    }
    
    const data = await response.json();
    return data.reservation;
  } catch (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }
}

export async function getReservationsByVehicle(vehicleId: number): Promise<Reservation[]> {
  try {
    const allReservations = await fetchReservations();
    return allReservations.filter(
      (r) => r.vehicleId === vehicleId && r.statut === 'Validée'
    );
  } catch (error) {
    console.error('Error fetching vehicle reservations:', error);
    return [];
  }
}

// Mock data pour développement
function getMockReservations(): Reservation[] {
  return [
    {
      id: '1',
      vehicleId: 1,
      nom: 'Jean Dupont',
      email: 'jean@email.com',
      dateDebut: '2025-12-05',
      dateFin: '2025-12-10',
      statut: 'En attente',
      dateDemande: '2025-11-30',
      total: 225,
    },
    {
      id: '2',
      vehicleId: 3,
      nom: 'Marie Martin',
      email: 'marie@email.com',
      dateDebut: '2025-12-15',
      dateFin: '2025-12-20',
      statut: 'Validée',
      dateDemande: '2025-11-29',
      total: 240,
    },
  ];
}