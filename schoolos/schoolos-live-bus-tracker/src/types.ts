export type BusStatus = 'ON_ROUTE' | 'STOPPED_AT_STOP' | 'GPS_OFFLINE' | 'ARRIVED_AT_SCHOOL';

export interface RouteStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  scheduledTime: string;
  isPassed: boolean;
  isNext: boolean;
  studentsBoarding?: number;
}

export interface SchoolBus {
  id: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  driverPhoto: string;
  licensePlate: string;
  status: BusStatus;
  currentSpeedKmH: number;
  estimatedArrival: string;
  distanceRemainingKm: number;
  nextStopName: string;
  studentsOnboard: number;
  totalCapacity: number;
  currentLat: number;
  currentLng: number;
  heading: number; // degrees 0-360
  lastGpsUpdate: string;
  schoolLocation: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  homeLocation: {
    name: string;
    studentName: string;
    address: string;
    lat: number;
    lng: number;
  };
  routeCoordinates: [number, number][]; // [lat, lng]
  stops: RouteStop[];
}

export interface ParentNotificationPreference {
  busDepartureAlert: boolean;
  approachingHomeAlert: boolean; // 2 stops away
  arrivedAtSchoolAlert: boolean;
  speedWarningAlert: boolean;
}
