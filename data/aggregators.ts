import { Transaction } from "./transaction.ts";
import addWeeks from "$date_fns/addWeeks/index.ts";
import isBefore from "$date_fns/isBefore/index.ts";
import isAfter from "$date_fns/isAfter/index.ts";
import { Category, Configuration } from "./settings.ts";
import { round } from "./utils.ts";

export function detectCategories(
  transactions: Transaction[],
  configuration: Configuration,
) {
  transactions.forEach((transaction) => {
    const category = findCategory(transaction, configuration);
    if(category){
      transaction.category = category;
    }
  });
}

function findCategory(transaction: Transaction, configuration: Configuration) {
  return configuration.categories.find((category) => {
    if (
      transactionIncludes(
        transaction,
        (t) => t.description,
        category.rule.descriptionContains,
      )
    ) {
      return true;
    }
    if (
      transactionIncludes(
        transaction,
        (t) => t.iban,
        category.rule.ibanContains,
      )
    ) {
      return true;
    }
    if (
      transactionIncludes(
        transaction,
        (t) => t.target,
        category.rule.targetContains,
      )
    ) {
      return true;
    }
    return false;
  });
}

function transactionIncludes(
  transaction: Transaction,
  mapper: (t: Transaction) => string,
  values?: string[],
) {
  const transactionValue = mapper(transaction)?.toLowerCase();
  if (!values || !transactionValue) {
    return false;
  }
  return values.some((it) => transactionValue.includes(it.toLowerCase()));
}

export function totalAmount(transactions: Transaction[]) {
  return round(transactions.reduce((sum, current) => sum + current.amount, 0));
}

export function getStartDate(transactions: Transaction[]) {
  if (transactions.length == 0) {
    return new Date();
  }
  let start = new Date();
  for (const transaction of transactions) {
    if (isBefore(transaction.date, start)) {
      start = transaction.date;
    }
  }
  return start;
}

export function getEndtDate(transactions: Transaction[]) {
  if (transactions.length == 0) {
    return new Date();
  }
  let end = new Date();
  for (const transaction of transactions) {
    if (isAfter(transaction.date, end)) {
      end = transaction.date;
    }
  }
  return end;
}

export function groupByCategories(transactions: Transaction[]) {
  const map = new Map<Category, Transaction[]>();
  transactions.forEach((it) => {
    if (map.has(it.category)) {
      map.get(it.category)?.push(it);
    } else {
      map.set(it.category, [it]);
    }
  });
  return map;
}

export function sumByCategories(transactions: Transaction[]){
  const categories = groupByCategories(transactions);
  return Array.from(categories.entries()).map(entry => ({
    category : entry[0],
    total : totalAmount(entry[1])
  }));
}

export function sortByAmount(transaction: Transaction[]){
  return transaction.sort((a,b)=> a.amount - b.amount);
}