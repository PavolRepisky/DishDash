import { DonationItem } from "./DonationItem";

export interface Donation {
  id: string;
  title: string;
  location: string;
  from: string;
  until: string;
  imageUrl: string;
  additionalInfo?: string;
  active: boolean;
  items: DonationItem[];
  createdAt?: string;
  imageAlt?: string;
  images?: string[];
}
