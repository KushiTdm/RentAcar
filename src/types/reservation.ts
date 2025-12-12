// src/types/reservation.ts

export type ReservationStatus = 'En attente' | 'Validée' | 'Refusée' | 'Annulée';

export interface Reservation {
  id: string;
  vehicleId: number;
  nom: string;
  email: string;
  dateDebut: string;
  dateFin: string;
  statut: ReservationStatus;
  dateDemande: string;
  total: number;
}

export interface CreateReservationDTO {
  vehicleId: number;
  nom: string;
  email: string;
  dateDebut: string;
  dateFin: string;
  total: number;
}

export interface UpdateReservationStatusDTO {
  id: string;
  statut: ReservationStatus;
}