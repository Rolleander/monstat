import {
  getEndtDate,
  getMonths,
  getStartDate,
  totalAmount,
} from "../../data/aggregators.ts";
import {
  COST,
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
import Chart from "../../islands/Chart.tsx";
import format from "$date_fns/format/index.js";

interface ExpensesProps {
  data: Transaction[];
  config: Configuration;
}

const LEFTOVER: Category = {
  color: "#00a814",
  name: "Remaining income",
  rule: {},
};

export default function CostsHistory(props: ExpensesProps) {
  fixDates(props.data);
  const months = getMonths(props.data);
  const categories = new Map<Category, number[]>(
    [...props.config.categories, DEFAULT_CATEGORY, LEFTOVER].filter((it) =>
      it.type !== TYPE_INVEST && it.type !== TYPE_SAVINGS
    ).map((category) => [category, []]),
  );
  months.forEach((month) => {
    const transactions = filter(props.data, inMonth(month));
    const totalIncome = totalAmount(filter(transactions, INCOME));
    let expenses = 0;
    Array.from(categories.keys()).forEach((category) => {
      if (category === LEFTOVER) {
        categories.get(category)!.push(Math.max(0, totalIncome - expenses));
      } else {
        const amount =
          totalAmount(filter(transactions, hasCategory(category), COST)) * -1;
        expenses += amount;
        categories.get(category)!.push(amount);
      }
    });
  });
  Array.from(categories.entries()).filter((it) => !it[1].some((t) => t > 0))
    .forEach((remove) => categories.delete(remove[0]));
  return (
      <Chart
        type="bar"
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
          datasets: Array.from(categories.keys()).map((category) => ({
            barPercentage: 0.9,
            categoryPercentage: 0.9,
            stack: "1",
            label: category.name,
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
