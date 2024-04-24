import { Transaction } from "./transaction.ts";
import parseIso from "$date_fns/parseISO/index.js";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function round(number: number) {
  return (Math.round(number * 100) / 100);
}

export function toEuro(number: number) {
  return round(number).toString().replace(/\./, ",").replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ".",
  ) + " €";
}

export function fixDates(transactions: Transaction[]) {
  if (IS_BROWSER) {
    transactions.forEach((it) => it.date = parseIso(it.dateIso, {}));
  }
}
