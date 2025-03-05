'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SimpleMap from '../../components/SimpleMap';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export default function HospitalLocator() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user's current location if they allow permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default location (could be a central location in your target area)
          setLocation({ lat: 40.7128, lng: -74.0060 }); // New York as example
        }
      );
    }

    // Attach the update function to window for map communication
    window.updateHospitalSelection = (updatedHospitals) => {
      setHospitals(updatedHospitals);
    };

    return () => {
      // Clean up
      delete window.updateHospitalSelection;
    };
  }, []);

  const searchHospitals = async () => {
    if (!location.lat || !location.lng) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Call the backend API that interfaces with Google Maps
      const response = await fetch(
        `${API_BASE_URL}/hospitals/nearby?latitude=${location.lat}&longitude=${location.lng}`
      );
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setHospitals(result.data);
      } else {
        throw new Error(result.message || 'Failed to find hospitals');
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setError('Failed to fetch hospital data. Please try again later.');
      
      // Fallback to mock data for demonstration or development
      if (process.env.NODE_ENV === 'development') {
        const mockHospitals = [
          { 
            id: "mock1", 
            name: 'General Hospital', 
            address: '123 Health St', 
            distance: '1.2 miles',
            lat: location.lat + 0.01, 
            lng: location.lng + 0.015 
          },
        ];
        
        setHospitals(mockHospitals);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleHospitalSelect = (hospitalId) => {
    setHospitals(hospitals.map(hospital => ({
      ...hospital,
      selected: hospital.id === hospitalId
    })));
  };

  return (
    <div id="__next">
      <div className="flex h-screen w-full flex-1 flex-col bg-mushroom-100 px-3 md:p-3">
        <div className="flex h-full w-full flex-grow flex-col gap-3 py-3 md:flex-grow md:p-0">
          <Header />
          <div className="flex flex-col flex-grow bg-white rounded-lg p-6 shadow">
            <h1 className="text-2xl font-bold mb-6">Hospital Locator</h1>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <div className="mb-6">
                  <p className="mb-2 text-volcanic-800">Your current location:</p>
                  {location.lat && location.lng ? (
                    <p className="font-medium">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
                  ) : (
                    <p className="text-red-500">Location access required</p>
                  )}
                </div>
                
                <button 
                  onClick={searchHospitals}
                  disabled={!location.lat || !location.lng || loading}
                  className={`w-full py-2 px-4 rounded-lg ${(!location.lat || !location.lng || loading) 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  {loading ? 'Searching...' : 'Find Nearby Hospitals'}
                </button>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-3">Nearby Hospitals</h2>
                  {hospitals.length > 0 ? (
                    <ul className="space-y-4">
                      {hospitals.map(hospital => (
                        <li 
                          key={hospital.id} 
                          className={`border p-3 rounded-md cursor-pointer transition-all ${
                            hospital.selected 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleHospitalSelect(hospital.id)}
                        >
                          <h3 className="font-medium">{hospital.name}</h3>
                          <p className="text-sm text-gray-600">{hospital.address}</p>
                          <p className="text-sm text-gray-600">Distance: {hospital.distance}</p>
                          {hospital.rating !== 'N/A' && (
                            <p className="text-sm text-gray-600">Rating: {hospital.rating} ⭐</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No hospitals found. Try searching first.</p>
                  )}
                </div>
              </div>
              
              <div className="w-full md:w-2/3 bg-gray-200 rounded-lg flex items-center justify-center" style={{ minHeight: '400px' }}>
                {hospitals.length > 0 ? (
                  <SimpleMap userLocation={location} hospitals={hospitals} loading={loading} />
                ) : (
                  <p className="text-gray-600">
                    {loading ? 'Loading map...' : 'Map will be displayed here'}
                    <br />
                    <span className="text-sm">(Search for nearby hospitals to view on map)</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add type definition for the window object
declare global {
  interface Window {
    updateHospitalSelection?: (hospitals: any[]) => void;
  }
}
