import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { Address } from '../interfaces/User';

interface LocationContextValues {
  currentLocation: Address | null;
  isLoadingLocation: boolean;
  locationError: string | null;
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<Address | null>;
  hasLocationPermission: boolean;
}

interface LocationProviderProps {
  children: React.ReactNode;
}

const LocationContext = createContext({} as LocationContextValues);

// Localização padrão (São Paulo - Centro)
const DEFAULT_LOCATION: Address = {
  address_id: 'default',
  street: 'Praça da Sé',
  number: 's/n',
  district: 'Sé',
  city: 'São Paulo',
  state: 'SP',
  zip_code: '01001-000',
  latitude: -23.5505,
  longitude: -46.6333,
  complement: '',
  consumer_id: '',
};

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [currentLocation, setCurrentLocation] = useState<Address | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  // Verificar permissão de localização ao iniciar
  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        // Se já tem permissão, busca localização automaticamente
        getCurrentLocation();
      } else {
        // Se não tem permissão, usa localização padrão
        setCurrentLocation(DEFAULT_LOCATION);
      }
    } catch (error) {
      console.error('Erro ao verificar permissão de localização:', error);
      setCurrentLocation(DEFAULT_LOCATION);
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasLocationPermission(granted);
      
      if (granted) {
        await getCurrentLocation();
      } else {
        setLocationError('Permissão de localização negada');
        setCurrentLocation(DEFAULT_LOCATION);
      }
      
      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão de localização:', error);
      setLocationError('Erro ao solicitar permissão');
      setCurrentLocation(DEFAULT_LOCATION);
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<Address | null> => {
    try {
      setIsLoadingLocation(true);
      setLocationError(null);

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // Fazer geocoding reverso para obter endereço
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const userLocation: Address = {
        address_id: 'current',
        street: address?.street || 'Rua não identificada',
        number: address?.streetNumber || 's/n',
        district: address?.district || address?.subregion || 'Bairro não identificado',
        city: address?.city || 'Cidade não identificada',
        state: address?.region || 'SP',
        zip_code: address?.postalCode || '00000-000',
        latitude,
        longitude,
        complement: '',
        consumer_id: '',
      };

      setCurrentLocation(userLocation);
      setIsLoadingLocation(false);
      return userLocation;
    } catch (error) {
      // Não mostrar erro se for apenas indisponibilidade de localização
      // (comum em emuladores ou quando serviços de localização estão desabilitados)
      if (error?.message && !error.message.includes('unavailable')) {
        console.error('Erro ao obter localização:', error);
      }
      setLocationError(null); // Não definir erro para não alarmar o usuário
      setCurrentLocation(DEFAULT_LOCATION);
      setIsLoadingLocation(false);
      return DEFAULT_LOCATION;
    }
  };

  const contextValue: LocationContextValues = {
    currentLocation,
    isLoadingLocation,
    locationError,
    requestLocationPermission,
    getCurrentLocation,
    hasLocationPermission,
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

