import { groupByCategories, totalAmount } from "../data/aggregators.ts";
import { COST, INCOME, filter } from "../data/filters.ts";
import { readData } from "../data/parser.ts";
import { TYPE_EXPENSES, TYPE_INVEST, TYPE_SAVINGS, readConfiguration } from "../data/settings.ts";
import { toEuro } from "../data/utils.ts";

import Menu from "../islands/Menu.tsx";

export default async function Home() {
  const config =  await readConfiguration();
  const data = await readData(config);
  const dataByCategories = groupByCategories(data);
  const initialBalance = config.initialBalance?? 0;
  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-lg mx-auto flex flex-col items-center justify-center">
        <div class="p-4">

          <Menu config={config}  data={data} ></Menu>

        <div class="flex flex-row gap-5 text-xl">
          <div>
          Balance: {  toEuro( totalAmount(data) + initialBalance)}          
          </div>
          <div>
          Income: {  toEuro( totalAmount(filter(data, INCOME )) + initialBalance )}          
          </div>
          <div>
          Spent: {  toEuro( totalAmount(filter(data, COST )))}          
          </div>
        </div>


      Expenses per category:
        <div class="flex flex-col gap-2">
        {Array.from( dataByCategories.keys()).filter(it=> it.type === undefined || it.type=== TYPE_EXPENSES  ).map(category => (
          <div>
            {category.name}:  {  toEuro( totalAmount(filter(dataByCategories.get(category)!,COST))*-1)}  
          </div>
        ))}
      </div>

      Savings per category:
        <div class="flex flex-col gap-2">
        {Array.from( dataByCategories.keys()).filter(it=> it.type === TYPE_INVEST || it.type=== TYPE_SAVINGS  ).map(category => (
         <div>
            {category.name}:  {  toEuro( totalAmount(dataByCategories.get(category)!) *-1)}  
          </div>
        ))}
      </div>

      </div>

      </div>
    </div>
  );
}
