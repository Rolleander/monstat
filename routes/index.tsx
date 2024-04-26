import { getEndtDate, getStartDate, totalAmount } from "../data/aggregators.ts";
import {
  COST,
  EXPENSE_CATEGORY,
  filter,
  INCOME,
  SAVINGS_OR_INVEST_CATEGORY,
} from "../data/filters.ts";
import { readData } from "../data/parser.ts";
import { readConfiguration } from "../data/settings.ts";
import { toDateString, toEuro, toPercentage } from "../data/utils.ts";
import Menu from "../islands/Menu.tsx";
import differenceInMonths from "$date_fns/differenceInMonths/index.ts";
import {
  RiBankFill,
  RiCalendar2Fill,
  RiCoinsFill,
  RiHandCoinLine,
  RiScalesFill,
} from "react-icons/ri";
import {ChartJs} from "$fresh_charts/deps.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default async function Home() {
  if(IS_BROWSER){
    console.log("import pluigi");
    import("npm:chartjs-plugin-zoom").then(plugin =>  {
      console.log("imported plugin", plugin);
      ChartJs.Chart.register( plugin.default);
    } );     

  }
  const config = await readConfiguration();
  const data = await readData(config);
  const startDate = getStartDate(data);
  const endDate = getEndtDate(data);
  const monthDiff = differenceInMonths(endDate, startDate);
  let timeSpan = monthDiff + " months";
  if (monthDiff > 12) {
    const years = Math.floor(monthDiff / 12);
    const months = monthDiff % 12;
    timeSpan = years + " years, " + months + " months";
  }
  const totalIncome = totalAmount(filter(data, INCOME));
  const totalSavings =
    totalAmount(filter(data, COST, SAVINGS_OR_INVEST_CATEGORY)) * -1;
  const savingsPercentage = totalSavings / totalIncome;
  const initialBalance = config.initialBalance ?? 0;
  return (
    <div class="max-w-screen-xl mx-auto flex flex-col gap-6 mt-4 items-end justify-center mb-6">
      <div class="w-5/6 flex flex-row gap-2 items-center  text-md border-b-2 border-blue-300 py-2 drop-shadow-md">
        <div class="text-3xl flex-grow text-gray-500 tracking-widest">
          <span class="font-bold text-stone-900">MON</span>
          ey
          <span class="font-bold text-stone-900">$TAT</span>
          s
        </div>
        <div class="bg-blue-300/50 p-2 rounded-md flex flex-col justify-center items-center">
          <div class="flex items-center gap-1 text-sm">
            <RiScalesFill /> Current balance
          </div>
          <div class="font-bold">
            {toEuro(totalAmount(data) + initialBalance, 0)}
          </div>
        </div>
        <div class="bg-green-300/50 p-2 rounded-md flex flex-col justify-center items-center">
          <div class="flex items-center gap-1 text-sm">
            <RiCoinsFill /> Total income
          </div>
          <div class="font-bold">
            {toEuro(totalIncome, 0)}
          </div>
        </div>
        <div class="bg-red-300/50 p-2 rounded-md flex flex-col justify-center items-center">
          <div class="flex items-center gap-1 text-sm">
            <RiHandCoinLine /> Total expenses
          </div>
          <div class="font-bold">
            {toEuro(totalAmount(filter(data, COST, EXPENSE_CATEGORY)) * -1, 0)}
          </div>
        </div>
        <div class="bg-fuchsia-300/50 p-2 rounded-md flex flex-col justify-center items-center">
          <div class="flex items-center gap-1 text-sm">
            <RiBankFill /> Total savings
          </div>
          <div class="font-bold">
            {toEuro(totalSavings, 0)}
            <span class="text-sm ml-2">
              ({toPercentage(savingsPercentage)})
            </span>
          </div>
        </div>
        <div class="text-sm flex flex-col justify-center items-center bg-slate-200 p-2 rounded-md">
          <div class="flex items-center gap-1">
            <RiCalendar2Fill /> {timeSpan}
          </div>
          <div class="font-bold">
            {toDateString(startDate)} - {toDateString(endDate)}
          </div>
        </div>
      </div>
      <Menu config={config} data={data}></Menu>
    </div>
  );
}
