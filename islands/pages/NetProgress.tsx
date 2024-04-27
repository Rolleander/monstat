import addMonths from "$date_fns/addMonths/index.ts";
import {
  getEndtDate,
  getMonths,
  getStartDate,
  totalAmount,
} from "../../data/aggregators.ts";
import {
  COST,
  EXPENSE_CATEGORY,
  filter,
  hasCategory,
  INCOME,
  inMonth,
} from "../../data/filters.ts";
import {
  Category,
  Configuration,
  DEFAULT_CATEGORY,
  TYPE_INVEST,
  TYPE_SAVINGS,
} from "../../data/settings.ts";
import { Transaction } from "../../data/transaction.ts";
import { fixDates, toEuro } from "../../data/utils.ts";
import Chart from "../Chart.tsx";
import format from "$date_fns/format/index.js";

interface ExpensesProps {
  data: Transaction[];
  config: Configuration;
}

const BALANCE: Category = {
  color: "#3271a8",
  name: "Current balance",
  type: TYPE_SAVINGS,
  rule: {},
};

export default function NetPrgoress(props: ExpensesProps) {
  fixDates(props.data);
  const months = getMonths(props.data);
  const categories = new Map<Category, number[]>(
    [...props.config.categories, BALANCE].filter((it) =>
      it.type === TYPE_INVEST || it.type === TYPE_SAVINGS
    ).map((category) => [category, []]),
  );
  months.forEach((month, index) => {
    const transactions = filter(props.data, inMonth(month));
    Array.from(categories.keys()).forEach((category) => {
      let prev = 0;
      if (index > 0) {
        prev += categories.get(category)![index - 1];
      }
      if (category === BALANCE) {
        let balance = totalAmount(transactions);
        if (index == 0) {
          balance += props.config.initialBalance;
        }
        categories.get(category)!.push(balance + prev);
      } else {
        const amount =
          totalAmount(filter(transactions, hasCategory(category))) * -1;
        categories.get(category)!.push(amount + prev);
      }
    });
  });
  Array.from(categories.entries()).filter((it) => !it[1].some((t) => t > 0))
    .forEach((remove) => categories.delete(remove[0]));
  return (
    <Chart
      type="line"
      options={{
        scales: {
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              callback: (value, indx, values) => toEuro(value as number),
            },
          },
        },
        plugins: {
          legend: {
            display: true,
          },
          zoom: {
            pan: {
              enabled: true,
              mode: "x",
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "x",
            },
          },
        },
      }}
      data={{
        labels: months.map((it) => format(it, "MM.yy", {})),
        datasets: Array.from(categories.keys()).reverse().map((category) => ({
          label: category == BALANCE
            ? category.name
            : `${category.name} (Acc.)`,
          data: categories.get(category)!.map((it) => Math.abs(it)),
          fill: true,
          pointStyle: false,
          backgroundColor: categories.get(category)!.map((it) =>
            category.color
          ),
        })),
      }}
    />
  );
}
