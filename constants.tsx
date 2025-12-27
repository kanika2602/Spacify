
import React from 'react';
import { Container, TransportMode } from './types';
import { Ship, Plane, Train, Truck } from 'lucide-react';

export const MOCK_CONTAINERS: Container[] = [
  {
    id: 'C1',
    providerId: 'P1',
    providerName: 'Adani Logistics Hub',
    origin: 'JNPT, Mumbai',
    destination: 'Dubai, UAE',
    departureDate: '2024-06-15',
    arrivalDate: '2024-06-22',
    mode: TransportMode.SEA,
    totalCapacity: 60,
    availableCapacity: 12.5,
    pricePerCBM: 35000,
    containerType: '40ft Standard',
    status: 'ACTIVE',
    utilities: { electricity: 95, water: 80, security: 90, connectivity: 85 }
  },
  {
    id: 'C2',
    providerId: 'P2',
    providerName: 'Blue Dart Aviation',
    origin: 'IGI, Delhi',
    destination: 'Heathrow, London',
    departureDate: '2024-06-12',
    arrivalDate: '2024-06-13',
    mode: TransportMode.AIR,
    totalCapacity: 20,
    availableCapacity: 0,
    pricePerCBM: 85000,
    containerType: 'ULD Air Cargo',
    status: 'FULL',
    utilities: { electricity: 100, water: 90, security: 100, connectivity: 98 }
  },
  {
    id: 'C3',
    providerId: 'P1',
    providerName: 'CONCOR India',
    origin: 'Tughlakabad ICD',
    destination: 'Mundra Port',
    departureDate: '2024-06-20',
    arrivalDate: '2024-06-21',
    mode: TransportMode.RAIL,
    totalCapacity: 30,
    availableCapacity: 28,
    pricePerCBM: 12000,
    containerType: '20ft Rail Wagon',
    status: 'ACTIVE',
    utilities: { electricity: 75, water: 60, security: 80, connectivity: 70 }
  }
];

export const MODE_ICONS = {
  [TransportMode.SEA]: <Ship size={18} />,
  [TransportMode.AIR]: <Plane size={18} />,
  [TransportMode.RAIL]: <Train size={18} />,
  [TransportMode.ROAD]: <Truck size={18} />,
};
