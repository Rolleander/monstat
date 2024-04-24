import { sumByCategories } from "../../data/aggregators.ts";
import { Configuration } from "../../data/settings.ts";
import { Transaction } from "../../data/transaction.ts";
import Chart from "../../islands/Chart.tsx";

interface BarChartProps {
  data: Transaction[];
  config: Configuration;
}

export default function (props: BarChartProps) {
  const entries = sumByCategories(props.data).filter((it) => it.total != 0);
  return (
      <Chart
        type="bar"
        options={{
          scales: { y: { beginAtZero: true } },
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
