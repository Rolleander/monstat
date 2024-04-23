import { Category } from "./settings.ts";
import { Transaction } from "./transaction.ts";

export type TransactionFilter = 
	 (transaction:  Transaction) => boolean;

export const INCOME : TransactionFilter= 
(transaction:  Transaction) => transaction.amount > 0

export const COST : TransactionFilter= 
(transaction:  Transaction) => transaction.amount < 0

export function filter(transactions : Transaction[], ...filters: TransactionFilter[]){
	return transactions.filter(transaction => !filters.some(filter => !filter(transaction)) );
}

export function inMonth(month : number, year : number) : TransactionFilter{
	return (transaction:  Transaction) => transaction.date.getFullYear() == year && transaction.date.getMonth() == month; 
}

export function inYear(year : number) : TransactionFilter{
	return (transaction:  Transaction) => transaction.date.getFullYear() == year;
}

export function hasCategory(category : Category) : TransactionFilter{
	return (transaction:  Transaction) => transaction.category == category;
}

export function hasNoCategory() : TransactionFilter{
	return (transaction:  Transaction) => transaction.category === undefined;
}

export function hasIban(...ibans : string[])  : TransactionFilter{
	return (transaction:  Transaction) => ibans.some(it => transaction.iban.includes(it));
}

export function hasDescription(...descriptions : string[])  : TransactionFilter{
	return (transaction:  Transaction) => descriptions.some(it => transaction.description.includes(it));
}

export function hasTarget(...targets : string[])  : TransactionFilter{
	return (transaction:  Transaction) => targets.some(it => transaction.target.includes(it));
}
