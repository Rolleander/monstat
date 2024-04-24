import { Category } from "./settings.ts";

export interface Transaction {
  amount: number;
  iban: string;
  target: string;
  description: string;
  date: Date;
  dateIso : string;
  category: Category;
}
