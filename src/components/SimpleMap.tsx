'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Location {
  lat: number;
  lng: number;
}

interface Hospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  selected?: boolean;
}

interface SimpleMapProps {
  userLocation: Location;
  hospitals: Hospital[];
  loading: boolean;
}

export default function SimpleMap({ userLocation, hospitals, loading }: SimpleMapProps) {
  const mapContainerRef = useRef(null);
  const [hoveredHospital, setHoveredHospital] = useState<Hospital | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const selected = hospitals.find(h => h.selected);
    setSelectedHospital(selected || null);
  }, [hospitals]);

  const handleMarkerClick = (hospital: Hospital) => {
    const updated = hospitals.map(h => ({
      ...h,
      selected: h.id === hospital.id
    }));

    if (window.updateHospitalSelection) {
      window.updateHospitalSelection(updated);
    }

    setSelectedHospital(hospital);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  };

  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
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
      <div className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${userLocation.lng},${userLocation.lat},12,0/1200x800?access_token=pk.eyJ1IjoiZGVtby1hY2NvdW50IiwiYSI6ImNsZGJ2ZHl3OTAzYTgzb3E5bGlhOGYzcXIifQ.d1mJst0GiM7yGDR570XQ6A')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.8
        }}>
      </div>

      <div className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${userLocation.lng},${userLocation.lat},12,0/1200x800?access_token=pk.eyJ1IjoiZGVtby1hY2NvdW50IiwiYSI6ImNsZGJ2ZHl3OTAzYTgzb3E5bGlhOGYzcXIifQ.d1mJst0GiM7yGDR570XQ6A')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'screen',
          opacity: 0.5
        }}>
      </div>
    </div>
  );
}