
export enum UserRole {
  ADMIN = 'ADMIN',
  PROVIDER = 'PROVIDER',
  TRADER = 'TRADER'
}

export type Language = 'en' | 'hi';

export enum TransportMode {
  SEA = 'SEA',
  AIR = 'AIR',
  RAIL = 'RAIL',
  ROAD = 'ROAD'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  SHIPPED = 'SHIPPED'
}

export interface HubUtilities {
  electricity: number; // 0-100
  water: number;       // 0-100
  security: number;    // 0-100
  connectivity: number; // 0-100
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  isApproved: boolean;
  companyName?: string;
  preferredLanguage?: Language;
}

export interface Container {
  id: string;
  providerId: string;
  providerName: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  mode: TransportMode;
  totalCapacity: number; 
  availableCapacity: number;
  pricePerCBM: number;
  containerType: string;
  status: 'ACTIVE' | 'FULL' | 'DEPARTED';
  utilities: HubUtilities;
}

export interface Booking {
  id: string;
  containerId: string;
  containerOrigin: string;
  containerDestination: string;
  spaceReserved: number;
  totalPrice: number;
  status: BookingStatus;
  timestamp: string;
}
