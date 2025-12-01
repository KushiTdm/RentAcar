// src/types/vehicle.ts
export interface Vehicle {
  id: number;
  marque: string;
  modele: string;
  tarifJournalier: number;
  statut: 'Disponible' | 'Réservé';
  dateDebutReservation?: string;
  dateFinReservation?: string;
}

export interface Reservation {
  vehicleId: number;
  nom: string;
  email: string;
  dateDebut: string;
  dateFin: string;
}
