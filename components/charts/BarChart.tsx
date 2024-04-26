import { sumByCategories } from "../../data/aggregators.ts";
import { Configuration } from "../../data/settings.ts";
import { Transaction } from "../../data/transaction.ts";
import { toEuro } from "../../data/utils.ts";
import Chart from "../../islands/Chart.tsx";

interface BarChartProps {
  animate : boolean;
  data: Transaction[];
  config: Configuration;
}

export default function (props: BarChartProps) {
  const entries = sumByCategories(props.data).filter((it) => it.total != 0);
  return (
    <Chart
      type="bar"
      options={{
        animation : props.animate ? {} : false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value, indx, values) => toEuro(value as number),
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
      data={{
        datasets: [{
          data: entries.map((it) => Math.abs(it.total)),
          backgroundColor: entries.map((it) => it.category.color),
        }],
        labels: entries.map((it) => it.category.name),
      }}
    />
  );
}
