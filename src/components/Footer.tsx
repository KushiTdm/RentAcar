// src/components/Footer.tsx
import { Car, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">AutoLoc</h3>
                <p className="text-sm text-gray-400">Location Premium</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Votre partenaire de confiance pour la location de véhicules. 
              Une flotte moderne et un service client exceptionnel depuis 2020.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">123 Avenue des Champs</p>
                  <p className="text-gray-400 text-sm">75008 Paris, France</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href="tel:+33123456789" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  +33 1 23 45 67 89
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href="mailto:contact@autoloc.fr" className="text-gray-300 text-sm hover:text-blue-400 transition-colors">
                  contact@autoloc.fr
                </a>
              </div>
            </div>
          </div>

          {/* Horaires */}
          <div>
            <h4 className="text-lg font-bold mb-4">Horaires d'ouverture</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Lundi - Vendredi</span>
                <span className="text-gray-300 font-semibold">8h - 19h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Samedi</span>
                <span className="text-gray-300 font-semibold">9h - 18h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Dimanche</span>
                <span className="text-gray-300 font-semibold">10h - 16h</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-700">
              <p className="text-xs text-blue-300">
                🌙 Service d'urgence disponible 24/7
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2025 AutoLoc. Tous droits réservés. | Données gérées via Google Sheets
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                Mentions légales
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                CGV
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}