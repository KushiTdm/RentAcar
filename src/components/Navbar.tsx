// src/components/Navbar.tsx
import { useState } from 'react';
import { Car, Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (section: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (section: string) => {
    onNavigate(section);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => handleNavigation('home')}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AutoLoc</h1>
              <p className="text-xs text-gray-600">Location Premium</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation('home')} 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Accueil
            </button>
            <button 
              onClick={() => handleNavigation('vehicles')} 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Nos Véhicules
            </button>
            <button 
              onClick={() => handleNavigation('contact')} 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </button>
            <button 
              onClick={() => handleNavigation('vehicles')}
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Réserver
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <button 
              onClick={() => handleNavigation('home')} 
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              Accueil
            </button>
            <button 
              onClick={() => handleNavigation('vehicles')} 
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              Nos Véhicules
            </button>
            <button 
              onClick={() => handleNavigation('contact')} 
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              Contact
            </button>
            <button 
              onClick={() => handleNavigation('vehicles')}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Réserver
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}