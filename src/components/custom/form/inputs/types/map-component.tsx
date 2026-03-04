'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  height: number;
  marker: [number, number] | null;
  onMapClick: (lat: number, lng: number) => void;
  disabled?: boolean;
}

export default function MapComponent({
  center,
  zoom,
  height,
  marker,
  onMapClick,
  disabled = false,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Create map
    const map = L.map(containerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Handle map click
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (!disabled) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });

    mapRef.current = map;

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Only run once on mount

  // Update map center when center prop changes
  useEffect(() => {
    if (mapRef.current && center[0] !== 0 && center[1] !== 0) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Update marker when marker prop changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // Add new marker if position is provided
    if (marker && marker[0] !== 0 && marker[1] !== 0) {
      const newMarker = L.marker(marker, {
        draggable: !disabled,
      }).addTo(mapRef.current);

      // Handle marker drag
      if (!disabled) {
        newMarker.on('dragend', (e: L.DragEndEvent) => {
          const position = e.target.getLatLng();
          onMapClick(position.lat, position.lng);
        });
      }

      markerRef.current = newMarker;
    }
  }, [marker, disabled, onMapClick]);

  // Update cursor style when disabled
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.cursor = disabled ? 'not-allowed' : 'crosshair';
    }
  }, [disabled]);

  return (
    <div
      ref={containerRef}
      style={{ 
        height: `${height}px`, 
        width: '100%',
        borderRadius: '0.5rem',
        overflow: 'hidden',
      }}
      className="border border-gray-200"
    />
  );
}
