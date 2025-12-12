// src/components/calendar/AvailabilityCalendar.tsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Vehicle } from '../../types/vehicle';
import { Reservation } from '../../types/reservation';
import { getReservationsByVehicle } from '../../services/reservations';

interface AvailabilityCalendarProps {
  vehicle: Vehicle;
  onSelectDates?: (startDate: string, endDate: string) => void;
}

export default function AvailabilityCalendar({ vehicle, onSelectDates }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, [vehicle.id]);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await getReservationsByVehicle(vehicle.id);
      setReservations(data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isDateReserved = (date: Date) => {
    return reservations.some((reservation) => {
      const start = new Date(reservation.dateDebut);
      const end = new Date(reservation.dateFin);
      return date >= start && date <= end;
    });
  };

  const isDateSelected = (date: Date) => {
    if (!selectedStart || !selectedEnd) return false;
    return date >= selectedStart && date <= selectedEnd;
  };

  const handleDateClick = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today || isDateReserved(date)) {
      return;
    }

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(date);
      setSelectedEnd(null);
    } else {
      if (date > selectedStart) {
        // Vérifier qu'il n'y a pas de réservation entre les dates
        let hasReservationBetween = false;
        const checkDate = new Date(selectedStart);
        while (checkDate <= date) {
          if (isDateReserved(checkDate)) {
            hasReservationBetween = true;
            break;
          }
          checkDate.setDate(checkDate.getDate() + 1);
        }

        if (!hasReservationBetween) {
          setSelectedEnd(date);
          if (onSelectDates) {
            onSelectDates(
              selectedStart.toISOString().split('T')[0],
              date.toISOString().split('T')[0]
            );
          }
        }
      } else {
        setSelectedStart(date);
        setSelectedEnd(null);
      }
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-12"></div>);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isPast = date < today;
    const reserved = isDateReserved(date);
    const selected = isDateSelected(date);
    const isStart = selectedStart && date.getTime() === selectedStart.getTime();
    const isEnd = selectedEnd && date.getTime() === selectedEnd.getTime();

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(date)}
        disabled={isPast || reserved}
        className={`h-12 rounded-lg font-medium transition-all ${
          isPast
            ? 'text-gray-300 cursor-not-allowed'
            : reserved
            ? 'bg-red-100 text-red-800 cursor-not-allowed'
            : selected
            ? 'bg-blue-500 text-white'
            : isStart || isEnd
            ? 'bg-blue-600 text-white ring-2 ring-blue-300'
            : 'hover:bg-blue-50 text-gray-700'
        }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
          <span>Disponibilités</span>
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-gray-900 min-w-[150px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-2">Chargement...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((name) => (
              <div key={name} className="text-center text-sm font-semibold text-gray-600">
                {name}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">{days}</div>

          <div className="mt-6 space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-700">Dates sélectionnées</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-gray-700">Réservé</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span className="text-gray-700">Disponible</span>
            </div>
          </div>

          {selectedStart && selectedEnd && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Période sélectionnée :
              </p>
              <p className="text-blue-800">
                Du {selectedStart.toLocaleDateString('fr-FR')} au{' '}
                {selectedEnd.toLocaleDateString('fr-FR')}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                {Math.ceil((selectedEnd.getTime() - selectedStart.getTime()) / (1000 * 60 * 60 * 24))}{' '}
                jour(s)
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}