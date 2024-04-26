import { Transaction } from "./transaction.ts";
import parseIso from "$date_fns/parseISO/index.js";
import { IS_BROWSER } from "$fresh/runtime.ts";
import format from "$date_fns/format/index.js";

export function round(number: number, digits = 2) {
  const factor = Math.pow(10, digits);
  return (Math.round(number * factor) / factor);
}

export function toEuro(number: number, digits = 2) {
  return round(number, digits).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: digits,
  });
}

export function toPercentage(number: number) {
  return Number(number).toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 2,
  });
}

export function toDateString(date: Date) {
  return format(date, "dd.MM.yyyy", {});
}

export function fixDates(transactions: Transaction[]) {
  if (IS_BROWSER) {
    transactions.forEach((it) => it.date = parseIso(it.dateIso, {}));
  }
}
