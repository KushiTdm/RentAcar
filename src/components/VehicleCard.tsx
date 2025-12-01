// src/components/VehicleCard.tsx
import { Calendar, Eye } from 'lucide-react';
import { Vehicle } from '../types/vehicle';

interface VehicleCardProps {
  vehicle: Vehicle;
  onReserve: (vehicle: Vehicle) => void;
  onViewDetails: (vehicle: Vehicle) => void;
}

// Mapping des images de véhicules
const vehicleImages: Record<string, string> = {
  'Peugeot 208': '/208.jpeg',
  'Renault Clio': '/clio.jpeg',
  'Citroën C3': '/c3.jpeg',
  'Volkswagen Golf': '/golf.jpeg',
  'Toyota Yaris': '/yaris.jpeg',
};

export default function VehicleCard({ vehicle, onReserve, onViewDetails }: VehicleCardProps) {
  const isAvailable = vehicle.statut === 'Disponible';
  const vehicleKey = `${vehicle.marque} ${vehicle.modele}`;
  const imageUrl = vehicleImages[vehicleKey] || '/208.jpeg';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image du véhicule */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img 
          src={imageUrl} 
          alt={`${vehicle.marque} ${vehicle.modele}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <span
          className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
            isAvailable
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {vehicle.statut}
        </span>
      </div>

      {/* Header avec nom du véhicule */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
        <h3 className="text-xl font-bold text-white">
          {vehicle.marque} {vehicle.modele}
        </h3>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Tarif journalier</span>
            <span className="text-3xl font-bold text-blue-900">
              {vehicle.tarifJournalier}€
            </span>
          </div>
          <span className="text-sm text-gray-500">par jour</span>
        </div>

        {!isAvailable && vehicle.dateDebutReservation && vehicle.dateFinReservation && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start space-x-2">
              <Calendar className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-red-800">Réservé du:</p>
                <p className="text-red-700">
                  {new Date(vehicle.dateDebutReservation).toLocaleDateString('fr-FR')} au{' '}
                  {new Date(vehicle.dateFinReservation).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onViewDetails(vehicle)}
            className="w-full py-3 rounded-lg font-semibold transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Voir les détails</span>
          </button>
          
          <button
            onClick={() => onReserve(vehicle)}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
              isAvailable
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:shadow-lg active:scale-95'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isAvailable}
          >
            {isAvailable ? 'Réserver ce véhicule' : 'Non disponible'}
          </button>
        </div>
      </div>
    </div>
  );
}