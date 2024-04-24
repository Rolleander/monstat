import { groupByCategories, totalAmount } from "../data/aggregators.ts";
import { COST, EXPENSE_CATEGORY, INCOME, filter } from "../data/filters.ts";
import {
  Configuration,
  TYPE_EXPENSES,
  TYPE_INVEST,
  TYPE_SAVINGS,
} from "../data/settings.ts";
import { Transaction } from "../data/transaction.ts";
import { toEuro } from "../data/utils.ts";
import BarChart from "./charts/BarChart.tsx";
import PieChart from "./charts/PieChart.tsx";

interface PeriodProps {
  data: Transaction[];
  config: Configuration;
}

export default function (props: PeriodProps) {
  const dataByCategories = groupByCategories(props.data);
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


      <div>
        Expenses per category:
        <div class="flex flex-col gap-2">
          {Array.from(dataByCategories.keys()).filter((it) =>
            it.type === undefined || it.type === TYPE_EXPENSES
          ).map((category) => (
            <div>
              {category.name}: {toEuro(
                totalAmount(filter(dataByCategories.get(category)!, COST)) * -1,
              )}
            </div>
          ))}
        </div>

        Savings per category:
        <div class="flex flex-col gap-2">
          {Array.from(dataByCategories.keys()).filter((it) =>
            it.type === TYPE_INVEST || it.type === TYPE_SAVINGS
          ).map((category) => (
            <div>
              {category.name}:{" "}
              {toEuro(totalAmount(dataByCategories.get(category)!) * -1)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
