'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Sample map component with more realistic appearance
export default function SimpleMap({ userLocation, hospitals, loading }) {
  const mapContainerRef = useRef(null);
  const [hoveredHospital, setHoveredHospital] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Find currently selected hospital
  useEffect(() => {
    const selected = hospitals.find(h => h.selected);
    setSelectedHospital(selected);
  }, [hospitals]);

  // Handle hospital marker click
  const handleMarkerClick = (hospital) => {
    // Update UI selection state
    const updated = hospitals.map(h => ({
      ...h,
      selected: h.id === hospital.id
    }));

    // Update parent component's state
    // This assumes the parent component passes a callback function
    if (window.updateHospitalSelection) {
      window.updateHospitalSelection(updated);
    }

    setSelectedHospital(hospital);
  };

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d;
  };

  function deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-3 text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full" ref={mapContainerRef}>
      {/* Map overlay with satellite imagery */}
      <div className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${userLocation.lng},${userLocation.lat},12,0/1200x800?access_token=pk.eyJ1IjoiZGVtby1hY2NvdW50IiwiYSI6ImNsZGJ2ZHl3OTAzYTgzb3E5bGlhOGYzcXIifQ.d1mJst0GiM7yGDR570XQ6A')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.8
        }}>
      </div>

      {/* Map overlay with roads */}
      <div className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${userLocation.lng},${userLocation.lat},12,0/1200x800?access_token=pk.eyJ1IjoiZGVtby1hY2NvdW50IiwiYSI6ImNsZGJ2ZHl3OTAzYTgzb3E5bGlhOGYzcXIifQ.d1mJst0GiM7yGDR570XQ6A')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'screen',
          opacity: 0.5
        }}>
      </div>

      {/* Map Legend */}
      <div className="absolute top-0 left-0 p-4 bg-white bg-opacity-80 rounded-br-lg z-10 shadow-md">
        <h3 className="font-medium text-sm">Map Legend</h3>
        <div className="flex items-center mt-1">
          <div className="w-4 h-4 rounded-full bg-blue-600 shadow-md flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-300"></div>
          </div>
          <span className="ml-2 text-xs">Your Location</span>
        </div>
        <div className="flex items-center mt-1">
          <div className="w-4 h-4 rounded-full bg-red-500 shadow-md flex items-center justify-center">
            <div className="w-2 h-2 text-white flex items-center justify-center text-[8px]">H</div>
          </div>
          <span className="ml-2 text-xs">Hospital</span>
        </div>
        <div className="flex items-center mt-1">
          <div className="w-4 h-4 rounded-full bg-green-500 shadow-md flex items-center justify-center">
            <div className="w-2 h-2 text-white flex items-center justify-center text-[8px]">H</div>
          </div>
          <span className="ml-2 text-xs">Selected Hospital</span>
        </div>
      </div>

      {/* User location marker */}
      <div className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: '50%',
          top: '50%'
        }}>
        <div className="relative">
          <div className="animate-ping absolute h-8 w-8 rounded-full bg-blue-400 opacity-50"></div>
          <div className="relative rounded-full h-5 w-5 bg-blue-600 border-2 border-white shadow-md flex items-center justify-center">
            <div className="h-1 w-1 rounded-full bg-white"></div>
          </div>
        </div>
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 text-xs rounded-md shadow-md whitespace-nowrap">
          Your Location
        </div>
      </div>

      {/* Hospital markers */}
      {hospitals.map(hospital => {
        // Calculate relative position based on lat/lng difference
        // This is a simplistic approach - in real maps we'd use proper projection
        const latDiff = hospital.lat - userLocation.lat;
        const lngDiff = hospital.lng - userLocation.lng;

        // Scale factor - adjust these to make markers appear at appropriate distances
        const scale = 1000;

        const top = 50 - (latDiff * scale);
        const left = 50 + (lngDiff * scale);

        // Calculate actual distance for display
        const distance = calculateDistance(
          userLocation.lat, userLocation.lng,
          hospital.lat, hospital.lng
        );

        const isSelected = hospital.selected;

        return (
          <div
            key={hospital.id}
            className={`absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${isSelected ? 'scale-125' : 'hover:scale-110'}`}
            style={{
              left: `${left}%`,
              top: `${top}%`
            }}
            onMouseEnter={() => setHoveredHospital(hospital)}
            onMouseLeave={() => setHoveredHospital(null)}
            onClick={() => handleMarkerClick(hospital)}
          >
            <div className="relative">
              <div className={`h-6 w-6 rounded-full ${isSelected ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center shadow-xl`}>
                <div className="text-white font-bold text-xs">H</div>
              </div>
              {(isSelected || hoveredHospital === hospital) && (
                <div className="absolute top-7 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-2 py-1 text-xs rounded shadow-lg whitespace-nowrap z-30">
                  <p className="font-semibold">{hospital.name}</p>
                  <p className="text-[10px] text-gray-600">{distance.toFixed(1)} km away</p>
                </div>
              )}

              {/* Direction line for selected hospital */}
              {isSelected && (
                <svg
                  height="300"
                  width="300"
                  className="absolute top-1/2 left-1/2 -z-10 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <line
                    x1="150"
                    y1="150"
                    x2="150"
                    y2="0"
                    style={{
                      stroke: '#10b981',
                      strokeWidth: 2,
                      strokeDasharray: '5,3',
                      strokeLinecap: 'round'
                    }}
                  />
                </svg>
              )}
            </div>
          </div>
        );
      })}

      {/* Compass */}
      <div className="absolute bottom-4 right-4 h-16 w-16 bg-white bg-opacity-80 rounded-full shadow-md flex items-center justify-center">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-gray-400">N</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rotate-90">
            <span className="text-xs text-gray-400">E</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rotate-180">
            <span className="text-xs text-gray-400">S</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center -rotate-90">
            <span className="text-xs text-gray-400">W</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center">
              <div className="h-6 w-1 bg-gray-200 absolute" style={{ transform: 'rotate(0deg)' }}></div>
              <div className="h-4 w-1 bg-red-500 absolute" style={{ transform: 'rotate(45deg)' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 px-2 py-1 rounded shadow-md">
        <div className="flex items-center">
          <div className="h-1 w-16 bg-gray-800"></div>
          <span className="ml-1 text-xs">500m</span>
        </div>
      </div>

      {/* Static map disclaimer */}
      <div className="absolute bottom-0 w-full text-center text-xs text-gray-500 bg-white bg-opacity-50 py-1">
        This is a static representation of map data. In a real application, integrate with Google Maps or Mapbox.
      </div>
    </div>
  );
}
