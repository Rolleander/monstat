import { useSignal } from "@preact/signals";
import {
  groupByCategories,
  sortByAmount,
  totalAmount,
} from "../data/aggregators.ts";
import { COST, EXPENSE_CATEGORY, filter, INCOME } from "../data/filters.ts";
import {
  Configuration,
  TYPE_EXPENSES,
  TYPE_INVEST,
  TYPE_SAVINGS,
} from "../data/settings.ts";
import { Transaction } from "../data/transaction.ts";
import { toDateString, toEuro } from "../data/utils.ts";
import Selection from "../islands/Selection.tsx";
import BarChart from "./charts/BarChart.tsx";
import PieChart from "./charts/PieChart.tsx";

interface PeriodProps {
  data: Transaction[];
  config: Configuration;
}

export default function (props: PeriodProps) {
  const dataByCategories = groupByCategories(props.data);
  const categories = Array.from(dataByCategories.keys());
  const categoryNames = categories.map((it) => it.name);
  const categoryTotals = Array.from(dataByCategories.values()).map((it) =>
    totalAmount(it)
  );
  const selectedCategory = useSignal(0);
  const categoryTransactions = dataByCategories.get(
    categories[selectedCategory.value],
  )!;
  return (
    <>
      <div class="h-72 flex flex-row gap-6">
        <BarChart
          config={props.config}
          data={filter(props.data, COST, EXPENSE_CATEGORY)}
        />
        <PieChart
          config={props.config}
          data={filter(props.data, INCOME)}
        />
      </div>

      <Selection
        options={categoryNames}
        totals={categoryTotals}
        selected={selectedCategory}
      />

      <table>
        <thead>
          <tr>
            <td>Date</td>
            <td>Amount</td>
            <td>IBAN</td>
            <td>Target</td>
            <td>Description</td>
          </tr>
        </thead>
        <tbody>
          {categoryTransactions.map((it) => (
            <tr>
              <td class="px-1">
                {toDateString(it.date)}
              </td>
              <td class="px-1 text-right text-nowrap">
                {toEuro(it.amount)}
              </td>
              <td class="px-1">
                {it.iban}
              </td>
              <td class="px-1">
                {it.target}
              </td>
              <td class="px-1 break-all text-balance ">
                {it.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
