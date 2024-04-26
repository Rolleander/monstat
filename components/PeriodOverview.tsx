import { Signal, useSignal } from "@preact/signals";
import {
  RiBankFill,
  RiCoinsFill,
  RiHandCoinLine,
  RiScalesFill,
  RiSubtractFill,
} from "react-icons/ri";
import {
  groupByCategories,
  sortByAmount,
  totalAmount,
} from "../data/aggregators.ts";
import {
  COST,
  EXPENSE_CATEGORY,
  filter,
  INCOME,
  SAVINGS_OR_INVEST_CATEGORY,
} from "../data/filters.ts";
import { Category, Configuration } from "../data/settings.ts";
import { Transaction } from "../data/transaction.ts";
import { toDateString, toEuro, toPercentage } from "../data/utils.ts";
import Selection from "../islands/Selection.tsx";
import BarChart from "./charts/BarChart.tsx";
import PieChart from "./charts/PieChart.tsx";

interface PeriodProps {
  animate: Signal<boolean>;
  category: Signal<Category | undefined>;
  data: Transaction[];
  config: Configuration;
}

export default function (props: PeriodProps) {
  const dataByCategories = groupByCategories(props.data);
  const categories = Array.from(dataByCategories.keys());
  const categoryOptions = categories.map((it) => ({
    category: it,
    total: totalAmount(dataByCategories.get(it)!),
  }));
  let categoryTransactions: Transaction[] = [];
  if (props.category.value) {
    categoryTransactions = sortByAmount(
      dataByCategories.get(
        props.category.value,
      ) ?? [],
    );
  }
  const totalIncome = totalAmount(filter(props.data, INCOME));
  const totalExpenses =
    totalAmount(filter(props.data, COST, EXPENSE_CATEGORY)) * -1;
  const totalSavings =
    totalAmount(filter(props.data, COST, SAVINGS_OR_INVEST_CATEGORY)) * -1;
  const savingsPercentage = totalSavings / totalIncome;
  const leftOver = totalIncome - totalExpenses - totalSavings;
  return (
    <>
      <div class="flex flex-col gap-2 bg-neutral-200 p-2 rounded-xl">
        <div class="flex  gap-2 p-2 ">
          <div class="flex flex-col gap-2 items-center flex-grow ">
            <div class="text-lg font-bold">Expenses</div>
            <div class="flex-grow w-full max-h-72">
              <BarChart
                animate={props.animate.value}
                config={props.config}
                data={filter(props.data, COST, EXPENSE_CATEGORY)}
              />
            </div>
          </div>
          <div class="flex flex-col gap-2 items-center">
            <div class="text-lg font-bold">Income</div>
            <div class="flex-grow w-full max-h-72">
              <PieChart
                animate={props.animate.value}
                config={props.config}
                data={filter(props.data, INCOME)}
              />
            </div>
          </div>
        </div>
        <div class="px-2 flex gap-2 justify-center items-center">
          <div class="bg-green-300/50 py-1 px-2 rounded-sm flex flex-col justify-center items-center">
            <div class="flex items-center gap-1 text-sm">
              <RiCoinsFill /> Income
            </div>
            <div class="font-bold">
              {toEuro(totalIncome)}
            </div>
          </div>
          <div>
            <RiSubtractFill />
          </div>
          <div class="bg-red-300/50  py-1 px-2 rounded-sm flex flex-col justify-center items-center">
            <div class="flex items-center gap-1 text-sm">
              <RiHandCoinLine /> Expenses
            </div>
            <div class="font-bold">
              {toEuro(totalExpenses)}
            </div>
          </div>
          <div>
            <RiSubtractFill />
          </div>
          <div class="bg-fuchsia-300/50  py-1 px-2 rounded-sm flex flex-col justify-center items-center">
            <div class="flex items-center gap-1 text-sm">
              <RiBankFill /> Savings
            </div>
            <div class="font-bold">
              {toEuro(totalSavings)}
               {totalSavings >0 && <span class="text-sm ml-2">
                ({toPercentage(savingsPercentage)})
              </span>}
            </div>
          </div>
          <div>
            <RiSubtractFill />
            <RiSubtractFill class="-mt-5" />
          </div>
          <div class="bg-blue-300/50  py-1 px-2 rounded-sm flex flex-col justify-center items-center">
            <div class="flex items-center gap-1 text-sm">
              <RiScalesFill /> Net Balance
            </div>
            <div class={` font-bold ${leftOver < 0 && "text-red-800"}`}>
              {toEuro(leftOver)}
            </div>
          </div>
        </div>
      </div>

      <Selection
        options={categoryOptions}
        selected={props.category}
      />

      <table class="table-fixed rounded-md border-2 ">
        <thead>
          <tr class="bg-slate-300 border-b-2 border-gray-500 font-bold">
            <td class="py-1 px-2">Date</td>
            <td class="py-1 px-2">Amount</td>
            <td class="py-1 px-2">IBAN</td>
            <td class="py-1 px-2">Target</td>
            <td class="py-1 px-2">Description</td>
          </tr>
        </thead>
        <tbody>
          {categoryTransactions.map((it, index) => (
            <tr
              class={`${index % 2 == 1 ? "bg-neutral-200" : "bg-stone-100"} `}
            >
              <td class="w-[8rem] px-2">
                {toDateString(it.date)}
              </td>
              <td
                class={`${
                  it.amount >= 0 ? "text-green-600" : "text-red-800"
                }  w-[10rem] px-2 text-right text-nowrap font-bold`}
              >
                {toEuro(it.amount)}
              </td>
              <td class="w-[10rem] px-2 text-sm">
                {it.iban}
              </td>
              <td class="px-2 text-sm">
                <p
                  class="w-[10rem] overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    webkitLineClamp: 3,
                    webkitBoxOrient: "vertical",
                  }}
                >
                  {it.target}
                </p>
              </td>
              <td class="px-2 text-sm">
                <p
                  class="w-[14rem] overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    webkitLineClamp: 3,
                    webkitBoxOrient: "vertical",
                  }}
                >
                  {it.description}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
