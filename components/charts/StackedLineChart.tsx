import {
  getEndtDate,
  getStartDate,
  sumByCategories,
  totalAmount,
} from "../../data/aggregators.ts";
import {
  Category,
  Configuration,
  DEFAULT_CATEGORY,
  TYPE_INVEST,
  TYPE_SAVINGS,
} from "../../data/settings.ts";
import { Transaction } from "../../data/transaction.ts";
import { fixDates, toEuro } from "../../data/utils.ts";
import addMonths from "$date_fns/addMonths/index.ts";
import isBefore from "$date_fns/isBefore/index.ts";
import Chart from "../../islands/Chart.tsx";
import {
  COST,
  filter,
  hasCategory,
  INCOME,
  inMonth,
} from "../../data/filters.ts";
import { toDateString } from "../../data/utils.ts";
import format from "$date_fns/format/index.js";

interface StackedLineProps {
  data: Transaction[];
  config: Configuration;
}

const LEFTOVER: Category = {
  color: "#00a814",
  name: "Remaining income",
  rule: {},
};

export default function StackedLineChart(props: StackedLineProps) {
  const start = getStartDate(props.data);
  const end = getEndtDate(props.data);
  const months = [start];
  const endMonth = end.getFullYear() * 12 + end.getMonth();
  let date = start;
  while (date.getFullYear() * 12 + date.getMonth() < endMonth) {
    date = addMonths(date, 1);
    months.push(date);
  }
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
        if (category === DEFAULT_CATEGORY) {
          console.log("default amount ", amount);
        }
        expenses += amount;
        categories.get(category)!.push(amount);
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
        datasets: Array.from(categories.keys()).map((category) => ({
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
