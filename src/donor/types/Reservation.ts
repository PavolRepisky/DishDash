import { DonationItem } from "./DonationItem";

export interface Reservation {
  id: string;
  title: string;
  location: string;
  from: string;
  until: string;
  additionalInfo?: string;
  active?: boolean;
  items: DonationItem[];
  createdAt?: string;
  imageAlt: string;
  imageUrl: string;
}
