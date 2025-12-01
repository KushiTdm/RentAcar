// src/components/VehicleDetailModal.tsx
import { X, Users, Fuel, Settings, Calendar } from 'lucide-react';
import { Vehicle } from '../types/vehicle';

interface VehicleDetailModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onReserve: (vehicle: Vehicle) => void;
}

// Mapping des images de véhicules
const vehicleImages: Record<string, string> = {
  'Peugeot 208': '/208.jpeg',
  'Renault Clio': '/clio.jpeg',
  'Citroën C3': '/c3.jpeg',
  'Volkswagen Golf': '/golf.jpeg',
  'Toyota Yaris': '/yaris.jpeg',
};

// Données des spécifications des véhicules
const vehicleSpecs: Record<string, {
  places: number;
  carburant: string;
  transmission: string;
  coffre: string;
}> = {
  'Peugeot 208': { places: 5, carburant: 'Essence', transmission: 'Manuelle', coffre: '311L' },
  'Renault Clio': { places: 5, carburant: 'Diesel', transmission: 'Manuelle', coffre: '300L' },
  'Citroën C3': { places: 5, carburant: 'Essence', transmission: 'Automatique', coffre: '300L' },
  'Volkswagen Golf': { places: 5, carburant: 'Diesel', transmission: 'Automatique', coffre: '380L' },
  'Toyota Yaris': { places: 5, carburant: 'Hybride', transmission: 'Automatique', coffre: '286L' },
};

export default function VehicleDetailModal({
  vehicle,
  onClose,
  onReserve,
}: VehicleDetailModalProps) {
  const vehicleKey = `${vehicle.marque} ${vehicle.modele}`;
  const specs = vehicleSpecs[vehicleKey] || {
    places: 5,
    carburant: 'Essence',
    transmission: 'Manuelle',
    coffre: '300L',
  };
  const imageUrl = vehicleImages[vehicleKey] || '/208.jpeg';
  
  const isAvailable = vehicle.statut === 'Disponible';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Image du véhicule */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={`${vehicle.marque} ${vehicle.modele}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="absolute bottom-6 left-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {vehicle.marque} {vehicle.modele}
            </h2>
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                isAvailable
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {vehicle.statut}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Caractéristiques */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Caractéristiques</h3>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Places</p>
                  <p className="font-semibold text-gray-900">{specs.places} passagers</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Fuel className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Carburant</p>
                  <p className="font-semibold text-gray-900">{specs.carburant}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transmission</p>
                  <p className="font-semibold text-gray-900">{specs.transmission}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Coffre</p>
                  <p className="font-semibold text-gray-900">{specs.coffre}</p>
                </div>
              </div>
            </div>

            {/* Tarification */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tarification</h3>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                <div className="text-center mb-4">
                  <p className="text-gray-700 mb-2">À partir de</p>
                  <p className="text-5xl font-bold text-blue-900">
                    {vehicle.tarifJournalier}€
                  </p>
                  <p className="text-gray-600">par jour</p>
                </div>
                
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between py-2 border-b border-blue-200">
                    <span>1-3 jours</span>
                    <span className="font-semibold">{vehicle.tarifJournalier}€/jour</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-blue-200">
                    <span>4-7 jours</span>
                    <span className="font-semibold text-green-700">
                      {Math.round(vehicle.tarifJournalier * 0.9)}€/jour (-10%)
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>7+ jours</span>
                    <span className="font-semibold text-green-700">
                      {Math.round(vehicle.tarifJournalier * 0.8)}€/jour (-20%)
                    </span>
                  </div>
                </div>
              </div>

              {!isAvailable &&
                vehicle.dateDebutReservation &&
                vehicle.dateFinReservation && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Calendar className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-red-800 mb-1">
                          Véhicule réservé
                        </p>
                        <p className="text-sm text-red-700">
                          Du{' '}
                          {new Date(vehicle.dateDebutReservation).toLocaleDateString('fr-FR')}{' '}
                          au{' '}
                          {new Date(vehicle.dateFinReservation).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              <button
                onClick={() => onReserve(vehicle)}
                disabled={!isAvailable}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  isAvailable
                    ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAvailable ? 'Réserver maintenant' : 'Non disponible'}
              </button>
            </div>
          </div>

          {/* Inclus dans la location */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Inclus dans la location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Kilométrage illimité</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Assurance tous risques</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Assistance 24/7</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>2ème conducteur gratuit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}