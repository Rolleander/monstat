import { join } from "$std/path/mod.ts";
import { readCSV } from "https://deno.land/x/csv/mod.ts";
import { Configuration, CsvFormat, DEFAULT_CATEGORY } from "./settings.ts";
import { Transaction } from "./transaction.ts";
import parseDate from "$date_fns/parse/index.js";
import { detectCategories } from "./aggregators.ts";

export async function readData(
  configuration: Configuration,
): Promise<Transaction[]> {
  const files = Deno.readDir("./csv");
  const promises = [];
  for await (const file of files) {
    if (!file.isFile) {
      continue;
    }
    const format = getCsvFormat(configuration, file.name);
    if (format) {
      console.log("read "+file.name+" with format "+format.fileBegin);
      promises.push(parseData(file.name, format));
    }else{
      console.error("no format found for file "+file.name);
    }
  }
  const transactions = (await Promise.all(promises)).flatMap((it) =>
    it
  ) as Transaction[];
  transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  console.log("finished loading data, detecting categories");
  detectCategories(transactions, configuration);
  console.log("done!");
  return transactions;
}

function getCsvFormat(
  configuration: Configuration,
  file: string,
): CsvFormat | undefined {
  return configuration.formats.find((it) =>
    file.toLowerCase().startsWith(it.fileBegin.toLowerCase())
  );
}

async function parseData(
  file: string,
  csvSetting: CsvFormat,
): Promise<Transaction[]> {
  const transactions: Transaction[] = [];
  const csvFile = await Deno.open(join("./csv", file));
  const csvParserConfig =  {
    columnSeparator: csvSetting.columnSeparator ?? ";",
    lineSeparator: csvSetting.lineSeparator ?? "\n",
    fromLine: csvSetting.fromLine ?? 1,
  };
  console.log("start parsing "+file, csvParserConfig);
  for await (
    const row of readCSV(csvFile, csvParserConfig)
  ) {
    const cells = await Array.fromAsync(row);   
    const transaction = parseRow(cells, csvSetting);
    if (transaction) {
      transactions.push(transaction);
    }
    else{
      console.error("could not parse row ", cells);
    }
  }
  csvFile.close();
  console.log(`finished reading ${file}, recorded ${transactions.length} transactions`);
  return transactions;
}

function parseRow(cells: string[], csvSetting: CsvFormat): Transaction {
  const date = parseDate(
    cells[csvSetting.columnIndexes.date],
    csvSetting.dateFormat,
    new Date(),
    {},
  );
  return {
    amount: parseAmount(cells[csvSetting.columnIndexes.amount]),
    iban: cells[csvSetting.columnIndexes.iban]?.toUpperCase() ?? "?",
    category: DEFAULT_CATEGORY,
    target: cells[csvSetting.columnIndexes.target]?.toLowerCase() ?? "?",
    date: date,
    dateIso: date.toISOString(),
    description: cells[csvSetting.columnIndexes.description]?.toLowerCase() ?? "?",
  };
}

function parseAmount(value : string){
  return parseFloat(value.replace(/\./, '').replace(/,/, '.'));
}
