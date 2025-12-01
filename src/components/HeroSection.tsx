// src/components/HeroSection.tsx
import { Car, CheckCircle, Calendar } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
  vehicleCount: number;
}

export default function HeroSection({ onNavigate, vehicleCount }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden mt-20">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6">
            Louez Votre Voiture
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200 mt-2">
              En Toute Simplicité
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl lg:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Une flotte moderne, des tarifs compétitifs et un service client exceptionnel pour tous vos déplacements
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={() => onNavigate('vehicles')}
              className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Voir nos véhicules
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-900 transition-all"
            >
              En savoir plus
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all">
              <Car className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-2xl font-bold mb-2">{vehicleCount} Véhicules</h3>
              <p className="text-blue-200">Flotte diversifiée et moderne</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-2xl font-bold mb-2">Service 24/7</h3>
              <p className="text-blue-200">Assistance disponible à tout moment</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-2xl font-bold mb-2">Réservation Simple</h3>
              <p className="text-blue-200">Processus rapide et sécurisé</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}