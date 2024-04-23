import { useSignal } from "@preact/signals";
import Chart from "../islands/Chart.tsx";
import {ChartColors} from "../charts/utils.tsx";
import {readConfiguration, CategoryType} from "../data/settings.ts";
import {readData} from "../data/parser.ts";
import { totalAmount } from "../data/aggregators.ts";
import { round, toEuro } from "../data/utils.ts";
import { filter, COST, INCOME } from "../data/filters.ts";
import { hasCategory, hasNoCategory } from "../data/filters.ts";
import { TYPE_INVEST } from "../data/settings.ts";
import { TYPE_SAVINGS } from "../data/settings.ts";
import { TYPE_EXPENSES } from "../data/settings.ts";

export default async function Home() {
  const config =  await readConfiguration();
  const data = await readData(config);
  const initialBalance = config.initialBalance?? 0;
  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <div class="p-4 mx-auto max-w-screen-md">

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
        {config.categories.filter(it=> it.type === undefined || it.type=== TYPE_EXPENSES  ).map(category => (
          <div>
            {category.name}:  {  toEuro( totalAmount(filter(data,COST, hasCategory(category)))*-1)}  
          </div>
        ))}
          <div>
            Sonstige:  {  toEuro( totalAmount(filter(data,COST, hasNoCategory()))*-1)}  
          </div>
      </div>

      Savings per category:
        <div class="flex flex-col gap-2">
        {config.categories.filter(it=> it.type === TYPE_INVEST || it.type===TYPE_SAVINGS  ).map(category => (
          <div>
            {category.name}:  {  toEuro( totalAmount(filter(data, hasCategory(category))) *-1)}  
          </div>
        ))}
      </div>


        <Chart
          type="line"
          options={{
            scales: { y: { beginAtZero: true } },
          }}
          data={{
            labels: ["1", "2", "3"],
            datasets: [
              {
                label: "Sessions",
                data: [123, 234, 234],
                borderColor: ChartColors.Red,
                borderWidth: 1,
              },
              {
                label: "Users",
                data: [346, 233, 123],
                borderColor: ChartColors.Blue,
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>

      </div>
    </div>
  );
}
