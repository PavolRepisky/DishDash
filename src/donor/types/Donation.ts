import { DonationItem } from "./DonationItem";

export interface Donation {
  id: string;
  title: string;
  location: string;
  from: string;
  until: string;
  additionalInfo?: string;
  active?: boolean;
  items: DonationItem[];
  createdAt?: string;
  imageUrl?: string;
  imageAlt?: string;
}
