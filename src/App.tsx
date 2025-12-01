// src/App.tsx
import { useState, useEffect, useRef } from 'react';
import { RefreshCw, CheckCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import VehicleCard from './components/VehicleCard';
import VehicleDetailModal from './components/VehicleDetailModal';
import ReservationModal from './components/ReservationModal';
import Footer from './components/Footer';
import { Vehicle } from './types/vehicle';
import { fetchVehicles } from './services/googleSheets';

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [detailVehicle, setDetailVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentSection, setCurrentSection] = useState<string>('home');
  
  const vehiclesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await fetchVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    
    if (section === 'vehicles' && vehiclesRef.current) {
      vehiclesRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'contact' && contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReservation = (reservation: {
    nom: string;
    email: string;
    dateDebut: string;
    dateFin: string;
  }) => {
    const days = Math.ceil(
      (new Date(reservation.dateFin).getTime() -
        new Date(reservation.dateDebut).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const total = selectedVehicle
      ? days * selectedVehicle.tarifJournalier
      : 0;

    setSuccessMessage(
      `Réservation confirmée pour ${selectedVehicle?.marque} ${selectedVehicle?.modele} du ${new Date(reservation.dateDebut).toLocaleDateString('fr-FR')} au ${new Date(reservation.dateFin).toLocaleDateString('fr-FR')}. Total: ${total}€`
    );
    setShowSuccess(true);
    setSelectedVehicle(null);

    setTimeout(() => {
      setShowSuccess(false);
      loadVehicles();
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <Navbar onNavigate={handleNavigate} />

      {/* Hero Section */}
      <HeroSection onNavigate={handleNavigate} vehicleCount={vehicles.length} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 animate-fadeIn">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">
                  Réservation réussie!
                </h3>
                <p className="text-green-800">{successMessage}</p>
                <p className="text-sm text-green-700 mt-2">
                  Note: Cette réservation est simulée. Pour une mise à jour
                  automatique dans Google Sheets, configurez l'API avec les droits
                  d'écriture.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Vehicles Section */}
        <div ref={vehiclesRef} className="scroll-mt-24">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Chargement des véhicules...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Notre Flotte ({vehicles.length} véhicules)
                  </h2>
                  <p className="text-gray-600">
                    Sélectionnez le véhicule qui correspond à vos besoins
                  </p>
                </div>
                <button
                  onClick={loadVehicles}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Actualiser</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onReserve={setSelectedVehicle}
                    onViewDetails={setDetailVehicle}
                  />
                ))}
              </div>

              {vehicles.length === 0 && (
                <div className="text-center py-20">
                  <div className="bg-white rounded-xl p-12 shadow-md">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <RefreshCw className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg mb-2">
                      Aucun véhicule disponible
                    </p>
                    <p className="text-gray-500 text-sm">
                      Configurez votre Google Sheet pour afficher les véhicules
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Contact Section */}
        <div ref={contactRef} className="scroll-mt-24 mt-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Contactez-nous
            </h2>
            <p className="text-gray-600 mb-8">
              Une question ? Notre équipe est là pour vous aider !
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Votre nom"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <input
                type="email"
                placeholder="Votre email"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <textarea
                placeholder="Votre message"
                rows={4}
                className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              ></textarea>
              <button className="md:col-span-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Envoyer le message
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {detailVehicle && (
        <VehicleDetailModal
          vehicle={detailVehicle}
          onClose={() => setDetailVehicle(null)}
          onReserve={(vehicle) => {
            setDetailVehicle(null);
            setSelectedVehicle(vehicle);
          }}
        />
      )}

      {selectedVehicle && (
        <ReservationModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onConfirm={handleReservation}
        />
      )}
    </div>
  );
}

export default App;