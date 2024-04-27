import { useSignal } from "@preact/signals";
import { Transaction } from "../data/transaction.ts";
import { Configuration } from "../data/settings.ts";
import Monthly from "./pages/Monthly.tsx";
import Yearly from "./pages/Yearly.tsx";
import CostsHistory from "./pages/CostsHistory.tsx";
import IncomeHistory from "./pages/IncomeHistory.tsx";
import NetProgress from "./pages/NetProgress.tsx";
import { ChartJs } from "$fresh_charts/deps.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

interface MenuProps {
  data: Transaction[];
  config: Configuration;
}

const MENU = [
  "Month overview",
  "Year overview",
  "Costs history",
  "Income history",
  "Savings progress",
  "TODO",
  "TODO",
  "TODO",
  "TODO",
  "TODO",
  "TODO",
];

export default function (props: MenuProps) {
  //const loading = useSignal(true);
  if (IS_BROWSER) { //&& loading.value
    console.log("import chartjs plugins");
    import("npm:chartjs-plugin-zoom@2.0.1").then((plugin) => {
      ChartJs.Chart.register(plugin.default);
      console.log("imported zoom plugin", plugin);
      // loading.value = false;
    });
    /* import("npm:chartjs-chart-sankey@0.12.0").then((plugin) => {
      ChartJs.Chart.register(plugin.SankeyController, plugin.Flow);
      console.log("imported sankey plugin", plugin);
    });*/
  }
  const page = useSignal(0);
  return (
    <div class="flex gap-4 w-full items-start">
      <div class="flex flex-col gap-2 bg-stone-300/50 p-2 rounded-md">
        {MENU.map((it, index) => (
          <button
            class={`text-lg ${
              page.value == index ? "bg-blue-500" : "bg-gray-400"
            } hover:bg-blue-700 hover:scale-105 text-white font-bold py-1 px-2 rounded  w-48 `}
            onClick={() => page.value = index}
          >
            {it}
          </button>
        ))}
      </div>
      <div class="flex-grow p-2">
        {page.value === 0 && (
          <Monthly
            config={props.config}
            data={props.data}
          />
        )}
        {page.value === 1 && <Yearly config={props.config} data={props.data} />}
        {page.value === 2 && (
          <CostsHistory config={props.config} data={props.data} />
        )}
        {page.value === 3 && (
          <IncomeHistory config={props.config} data={props.data} />
        )}
        {page.value === 4 && (
          <NetProgress config={props.config} data={props.data} />
        )}
      </div>
    </div>
  );
}
