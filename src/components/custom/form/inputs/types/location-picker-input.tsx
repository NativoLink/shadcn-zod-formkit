'use client';

import { useState, useCallback, useMemo, JSX, lazy, Suspense } from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { BaseInput, FieldProps } from '../base';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Loader2, 
  X,
  Copy,
  Check
} from 'lucide-react';

// Lazy load map component to avoid SSR issues
const MapComponent = lazy(() => import('./map-component'));

export class LocationPickerInput extends BaseInput {
  render(): JSX.Element {
    const { input, form, isSubmitting } = this;
    return (
      <FieldLocationPicker form={form} input={input} isSubmitting={isSubmitting} />
    );
  }
}

interface Props {
  form: UseFormReturn;
  input: FieldProps;
  isSubmitting?: boolean;
}

export interface LocationData {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  formattedAddress?: string;
}

// Nominatim API for geocoding (OpenStreetMap)
const geocodeAddress = async (address: string): Promise<LocationData | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        formattedAddress: result.display_name,
        address: result.display_name,
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Reverse geocoding (coordinates to address)
const reverseGeocode = async (lat: number, lng: number): Promise<LocationData> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    
    return {
      lat,
      lng,
      formattedAddress: data.display_name,
      address: data.display_name,
      city: data.address?.city || data.address?.town || data.address?.village,
      country: data.address?.country,
      postalCode: data.address?.postcode,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return { lat, lng };
  }
};

const FieldLocationPicker = ({ input, form, isSubmitting }: Props): JSX.Element => {
  return (
    <FormField
      key={input.name as string}
      control={form.control}
      name={input.name as string}
      render={({ field }) => (
        <FormItem className={input.className}>
          {input.label && <FormLabel><b>{input.label}</b></FormLabel>}
          <FormControl>
            <LocationPickerComponent
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                input.onChange?.([value], form.getValues());
              }}
              onBlur={field.onBlur}
              disabled={input.disabled || isSubmitting}
              required={input.required}
              defaultZoom={input.defaultZoom}
              showSearch={input.showSearch}
              showCurrentLocation={input.showCurrentLocation}
              showCoordinates={input.showCoordinates}
              height={input.height}
            />
          </FormControl>
          {input.description && <FormDescription>{input.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface LocationPickerComponentProps {
  value?: LocationData;
  onChange: (value: LocationData | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  defaultZoom?: number;
  showSearch?: boolean;
  showCurrentLocation?: boolean;
  showCoordinates?: boolean;
  height?: number;
}

function LocationPickerComponent({
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  defaultZoom = 13,
  showSearch = true,
  showCurrentLocation = true,
  showCoordinates = true,
  height = 400,
}: LocationPickerComponentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Default location (center of the world)
  const defaultLocation: LocationData = useMemo(() => ({
    lat: 0,
    lng: 0,
  }), []);

  const currentLocation = value || defaultLocation;

  // Handle map click
  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    if (disabled) return;
    
    const locationData = await reverseGeocode(lat, lng);
    onChange(locationData);
  }, [disabled, onChange]);

  // Handle search
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const result = await geocodeAddress(searchQuery);
    setIsSearching(false);
    
    if (result) {
      onChange(result);
    }
  }, [searchQuery, onChange]);

  // Handle current location
  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada en este navegador');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationData = await reverseGeocode(latitude, longitude);
        onChange(locationData);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('No se pudo obtener la ubicación actual');
        setIsGettingLocation(false);
      }
    );
  }, [onChange]);

  // Copy coordinates
  const handleCopyCoordinates = useCallback(() => {
    const coords = `${currentLocation.lat}, ${currentLocation.lng}`;
    navigator.clipboard.writeText(coords);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  }, [currentLocation]);

  // Handle keyboard
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  // Handle clear
  const handleClear = useCallback(() => {
    onChange(null);
  }, [onChange]);

  return (
    <Card className="p-4 space-y-4">
      {/* Search bar */}
      {showSearch && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar dirección..."
              disabled={disabled || isSearching}
              className="pl-10"
            />
          </div>
          <Button
            type="button"
            onClick={handleSearch}
            disabled={disabled || isSearching || !searchQuery.trim()}
            variant="secondary"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
          {showCurrentLocation && (
            <Button
              type="button"
              onClick={handleCurrentLocation}
              disabled={disabled || isGettingLocation}
              variant="secondary"
              title="Usar ubicación actual"
            >
              {isGettingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      )}

      {/* Map */}
      <div className="relative">
        <Suspense fallback={
          <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ height: `${height}px` }}>
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        }>
          <MapComponent
            center={[currentLocation.lat, currentLocation.lng]}
            zoom={defaultZoom}
            height={height}
            marker={value ? [value.lat, value.lng] : null}
            onMapClick={handleMapClick}
            disabled={disabled}
          />
        </Suspense>
      </div>

      {/* Location info */}
      {value && (
        <div className="space-y-2">
          {value.formattedAddress && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{value.formattedAddress}</span>
            </div>
          )}

          {showCoordinates && (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
                <span>Lat: {value.lat.toFixed(6)}</span>
                <span>•</span>
                <span>Lng: {value.lng.toFixed(6)}</span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleCopyCoordinates}
                className="h-6 px-2"
              >
                {copiedCoords ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Clear button */}
      {value && !disabled && !required && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Limpiar ubicación
        </Button>
      )}

      {/* Help text */}
      <p className="text-xs text-gray-500">
        💡 Haz click en el mapa para marcar una ubicación o busca una dirección.
      </p>
    </Card>
  );
}
