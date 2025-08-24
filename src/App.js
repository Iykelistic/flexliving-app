import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import PropertyDetails from './pages/PropertyDetails';
import { Building2 } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleViewProperty = (propertyName) => {
    setSelectedProperty(propertyName);
    setCurrentView('property');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedProperty(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Flex Living</h1>
                <p className="text-sm text-gray-500">Reviews Dashboard</p>
              </div>
            </div>
            <nav className="flex space-x-8">
              <button
                onClick={handleBackToDashboard}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard onViewProperty={handleViewProperty} />
        )}
        {currentView === 'property' && selectedProperty && (
          <PropertyDetails 
            propertyName={selectedProperty}
            onBack={handleBackToDashboard}
          />
        )}
      </main>
    </div>
  );
}

export default App;