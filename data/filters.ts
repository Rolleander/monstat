import { TYPE_EXPENSES } from "./settings.ts";
import { TYPE_SAVINGS } from "./settings.ts";
import { TYPE_INVEST } from "./settings.ts";
import { Category } from "./settings.ts";
import { Transaction } from "./transaction.ts";

export type TransactionFilter = 
	 (transaction:  Transaction) => boolean;

export const INCOME : TransactionFilter= 
(transaction:  Transaction) => transaction.amount > 0

export const COST : TransactionFilter= 
(transaction:  Transaction) => transaction.amount < 0

export const EXPENSE_CATEGORY  : TransactionFilter= 
(transaction:  Transaction) => transaction.category.type ===undefined || transaction.category.type == TYPE_EXPENSES;

export const SAVINGS_OR_INVEST_CATEGORY  : TransactionFilter= 
(transaction:  Transaction) => transaction.category.type ===TYPE_INVEST || transaction.category.type == TYPE_SAVINGS;

export function filter(transactions : Transaction[], ...filters: TransactionFilter[]){
	return transactions.filter(transaction => !filters.some(filter => !filter(transaction)) );
}

export function inMonth(month : Date) : TransactionFilter{
	return (transaction:  Transaction) => transaction.date.getFullYear() == month.getFullYear() && transaction.date.getMonth() == month.getMonth(); 
}

export function inYear(year : number) : TransactionFilter{
	return (transaction:  Transaction) => transaction.date.getFullYear() == year;
}

export function hasCategory(category : Category) : TransactionFilter{
	return (transaction:  Transaction) => transaction.category == category;
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
