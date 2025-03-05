'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import SimpleMap from '../../components/SimpleMap';

export default function HospitalLocator() {
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060 });
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);

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

    // Attach the update function to window for map->list communication
    window.updateHospitalSelection = (updatedHospitals) => {
      setHospitals(updatedHospitals);
    };
  }, []);

  const searchHospitals = async () => {
    if (!location.lat || !location.lng) return;
    
    setLoading(true);
    
    try {
      // Simulating API response with more realistic data including coordinates
      setTimeout(() => {
        // Generate hospital coordinates around the user's location
        const mockHospitals = [
          { 
            id: '1', 
            name: 'General Hospital', 
            address: '123 Health St', 
            distance: '1.2 miles',
            lat: location.lat + 0.01, 
            lng: location.lng + 0.015 
          },
          { 
            id: '2', 
            name: 'Community Medical Center', 
            address: '456 Care Ave', 
            distance: '2.4 miles',
            lat: location.lat - 0.008, 
            lng: location.lng + 0.02 
          },
          { 
            id: '3', 
            name: 'Emergency Care Facility', 
            address: '789 Aid Blvd', 
            distance: '3.5 miles',
            lat: location.lat + 0.02, 
            lng: location.lng - 0.01 
          },
          { 
            id: '4', 
            name: 'University Hospital', 
            address: '101 Medical Campus', 
            distance: '4.1 miles',
            lat: location.lat - 0.015, 
            lng: location.lng - 0.018 
          },
          { 
            id: '5', 
            name: 'Children\'s Healthcare Center', 
            address: '234 Pediatric Way', 
            distance: '2.8 miles',
            lat: location.lat + 0.005, 
            lng: location.lng - 0.025 
          },
        ];
        
        setHospitals(mockHospitals);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error fetching hospitals:", error);
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
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No hospitals found. Try searching first.</p>
                  )}
                </div>
              </div>
              
              <div className="w-full md:w-2/3 bg-gray-200 rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
                {hospitals.length > 0 ? (
                  <SimpleMap userLocation={location} hospitals={hospitals} loading={loading} />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <p className="text-gray-600 text-center">
                      {loading ? 'Loading map...' : 'Search for hospitals to see them on the map'}
                      <br />
                      <span className="text-sm">(Sample map visualization)</span>
                    </p>
                  </div>
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
