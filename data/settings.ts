export interface Configuration{
	initialBalance: number,
	formats : CsvFormat[],
	categories: Category[]
}

export interface CsvFormat{
	fileBegin: string;
	columnSeparator?: string;
	lineSeparator?: string;
	fromLine?: number;
	dateFormat: string;
	columnIndexes: {
		amount : number;
		iban : number;
		target : number;
		description : number;
		date : number;	
	}
}

export interface Category{
	name : string;
	type? :string;
	color : string;
	rule: CategoryRule;
}

export const TYPE_EXPENSES = "EXPENSES";
export const TYPE_INVEST = "INVEST";
export const TYPE_SAVINGS = "SAVINGS";

export const DEFAULT_CATEGORY : Category = {
	name : "Sonstige",
	type: TYPE_EXPENSES,
	color: "#808080",
	rule: {}
};

export interface CategoryRule{
	targetContains? : string[];
	descriptionContains? : string[];
	ibanContains? : string[];
}

export async function readConfiguration() {
	return JSON.parse(await Deno.readTextFile("./config.json")) as Configuration;
}