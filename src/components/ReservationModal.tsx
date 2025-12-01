// src/components/ReservationModal.tsx
import { useState } from 'react';
import { X, Calendar, User, Mail, AlertCircle } from 'lucide-react';
import { Vehicle } from '../types/vehicle';
import { isVehicleAvailable } from '../services/googleSheets';

interface ReservationModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onConfirm: (reservation: {
    nom: string;
    email: string;
    dateDebut: string;
    dateFin: string;
  }) => void;
}

export default function ReservationModal({
  vehicle,
  onClose,
  onConfirm,
}: ReservationModalProps) {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    dateDebut: '',
    dateFin: '',
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!formData.nom.trim()) {
      newErrors.push('Le nom est requis');
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.push('Un email valide est requis');
    }

    if (!formData.dateDebut || !formData.dateFin) {
      newErrors.push('Les dates de début et de fin sont requises');
    }

    if (formData.dateDebut && formData.dateFin) {
      const start = new Date(formData.dateDebut);
      const end = new Date(formData.dateFin);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        newErrors.push('La date de début ne peut pas être dans le passé');
      }

      if (end <= start) {
        newErrors.push('La date de fin doit être après la date de début');
      }

      if (!isVehicleAvailable(vehicle, formData.dateDebut, formData.dateFin)) {
        newErrors.push('Le véhicule n\'est pas disponible pour ces dates');
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    onConfirm(formData);
  };

  const calculateTotal = () => {
    if (!formData.dateDebut || !formData.dateFin) return 0;
    const start = new Date(formData.dateDebut);
    const end = new Date(formData.dateFin);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days * vehicle.tarifJournalier;
  };

  const total = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">
            Réserver votre véhicule
          </h2>
          <p className="text-slate-300">
            {vehicle.marque} {vehicle.modele} - {vehicle.tarifJournalier}€/jour
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-red-800 mb-1">Erreurs détectées:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Nom complet
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
              placeholder="votre.email@exemple.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date de début
            </label>
            <input
              type="date"
              value={formData.dateDebut}
              onChange={(e) =>
                setFormData({ ...formData, dateDebut: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date de fin
            </label>
            <input
              type="date"
              value={formData.dateFin}
              onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
            />
          </div>

          {total > 0 && (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total estimé:</span>
                <span className="text-2xl font-bold text-slate-800">{total}€</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {Math.ceil(
                  (new Date(formData.dateFin).getTime() -
                    new Date(formData.dateDebut).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{' '}
                jour(s) × {vehicle.tarifJournalier}€
              </p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors active:scale-95"
            >
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
