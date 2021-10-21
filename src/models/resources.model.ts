export interface Resource {
  type: 'tent' | 'bungalow' | 'old-bungalow';
  availablePlaces: number;
  name: string;
}

export interface Reservation {
  id?: string;
  startDate: string;
  endDate: string;
  resources: string[];
  name: string;
  color: string;
  numberOfPersons: number;
};

export interface MappedReservation extends Reservation {
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
};

export interface ReservationMapElement {
  [id: string]: MappedReservation;
};

export interface ResourceMapElement {
  [resourceName: string]: {
    [date: string]: string[]
  }
}