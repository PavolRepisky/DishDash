import { ReservationItem } from "./ReservationItem";

export interface Reservation {
  id: string;
  donationId: string;
  active?: boolean;
  items: ReservationItem[];
  createdAt?: string;
}
