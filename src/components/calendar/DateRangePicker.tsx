// src/components/calendar/DateRangePicker.tsx
import { useState, useEffect } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { Vehicle } from '../../types/vehicle';
import { getReservationsByVehicle } from '../../services/reservations';

interface DateRangePickerProps {
  vehicle: Vehicle;
  onDatesChange: (startDate: string, endDate: string) => void;
  initialStart?: string;
  initialEnd?: string;
}

export default function DateRangePicker({
  vehicle,
  onDatesChange,
  initialStart = '',
  initialEnd = '',
}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      checkAvailability();
    }
  }, [startDate, endDate]);

  const checkAvailability = async () => {
    setIsChecking(true);
    setError('');

    try {
      const reservations = await getReservationsByVehicle(vehicle.id);
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Validations
      if (start < today) {
        setError('La date de début ne peut pas être dans le passé');
        return;
      }

      if (end <= start) {
        setError('La date de fin doit être après la date de début');
        return;
      }

      // Vérifier les chevauchements avec les réservations existantes
      const hasConflict = reservations.some((reservation) => {
        const resStart = new Date(reservation.dateDebut);
        const resEnd = new Date(reservation.dateFin);
        
        return !(end < resStart || start > resEnd);
      });

      if (hasConflict) {
        setError('Le véhicule n\'est pas disponible pour ces dates');
        return;
      }

      // Tout est OK
      onDatesChange(startDate, endDate);
    } catch (error) {
      console.error('Error checking availability:', error);
      setError('Erreur lors de la vérification de la disponibilité');
    } finally {
      setIsChecking(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMinEndDate = () => {
    if (!startDate) return getMinDate();
    const start = new Date(startDate);
    start.setDate(start.getDate() + 1);
    return start.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Date de début
          </label>
          <input
            type="date"
            value={startDate}
            min={getMinDate()}
            onChange={(e) => {
              setStartDate(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Date de fin
          </label>
          <input
            type="date"
            value={endDate}
            min={getMinEndDate()}
            onChange={(e) => {
              setEndDate(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={!startDate}
          />
        </div>
      </div>

      {isChecking && (
        <div className="flex items-center space-x-2 text-blue-600">
          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="text-sm">Vérification de la disponibilité...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {startDate && endDate && !error && !isChecking && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-green-900 mb-1">
            ✓ Véhicule disponible
          </p>
          <p className="text-sm text-green-800">
            Du {new Date(startDate).toLocaleDateString('fr-FR')} au{' '}
            {new Date(endDate).toLocaleDateString('fr-FR')}
          </p>
        </div>
      )}
    </div>
  );
}