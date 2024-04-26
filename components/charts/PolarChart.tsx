import { sumByCategories } from "../../data/aggregators.ts";
import { Configuration } from "../../data/settings.ts";
import { Transaction } from "../../data/transaction.ts";
import { toEuro } from "../../data/utils.ts";
import Chart from "../../islands/Chart.tsx";

interface PolarChartProps {
  data: Transaction[];
  config: Configuration;
}

export default function (props: PolarChartProps) {
  const entries = sumByCategories(props.data).filter((it) => it.total != 0);
  return (
    <Chart
      type="polarArea"
      options={{
        animation : false,
        scales: {
          r: {
            pointLabels: {
              display: true,
              centerPointLabels: true,
              font: {
                size: 14,
              },
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
        labels: entries.map((it) =>
          `${it.category.name} (${toEuro(Math.abs(it.total))}) `
        ),
      }}
    />
  );
}
