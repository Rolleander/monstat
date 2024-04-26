import { Transaction } from "./transaction.ts";
import parseIso from "$date_fns/parseISO/index.js";
import { IS_BROWSER } from "$fresh/runtime.ts";
import format from "$date_fns/format/index.js";

export function round(number: number) {
  return (Math.round(number * 100) / 100);
}

export function toEuro(number: number) {
  return round(number).toLocaleString('de-DE', {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2
  })
}

export function toPercentage(number : number){
  return Number(number).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2});
}

export function toDateString(date : Date){
  return format(date, "dd.MM.yyyy", {});
}

export function fixDates(transactions: Transaction[]) {
  if (IS_BROWSER) {
    transactions.forEach((it) => it.date = parseIso(it.dateIso, {}));
  }
}
