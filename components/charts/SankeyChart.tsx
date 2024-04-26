import { sumByCategories } from "../../data/aggregators.ts";
import { Configuration } from "../../data/settings.ts";
import { Transaction } from "../../data/transaction.ts";
import { toEuro } from "../../data/utils.ts";
import Chart from "../../islands/Chart.tsx";

interface SankeyChartProps {
  data: Transaction[];
  config: Configuration;
}

const CENTER = "-sankey-center-group-";

export default function (props: SankeyChartProps) {
  const entries = sumByCategories(props.data).filter((it) => it.total != 0);
  const incomes = entries.filter((it) => it.total > 0);
  const expenses = entries.filter((it) => it.total < 0);
  const labels = {};
  labels[CENTER] = "";
  const data = [];
  incomes.forEach((it) => {
    data.push({
      from: "in_" + it.category.name,
      to: CENTER,
      flow: it.total,
    });
    labels["in_" + it.category.name] = it.category.name;
  });
  expenses.forEach((it) => {
    data.push({
      to: "out_" + it.category.name,
      from: CENTER,
      flow: it.total * -1,
    });
    labels["out_" + it.category.name] = it.category.name;
  });
  return (
    <Chart
      type="sankey"
      data={{
        datasets: [{
          data: data,
          colorMode: "gradient",
          labels: labels,
          size: "max",
        }],
      }}
    />
  );
}
