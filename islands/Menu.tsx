import { useSignal } from "@preact/signals";
import { Transaction } from "../data/transaction.ts";
import { Configuration } from "../data/settings.ts";
import Monthly from "./pages/Monthly.tsx";
import Yearly from "./pages/Yearly.tsx";
import CostsHistory from "./pages/CostsHistory.tsx";
import IncomeHistory from "./pages/IncomeHistory.tsx";
import NetProgress from "./pages/NetProgress.tsx";
import Interest from "./pages/Interest.tsx";
import Matrix from "./pages/Matrix.tsx";
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
  "Investing interest",
  "Matrix",
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
    <div class="flex gap-4 w-full items-start ">
      <div class="flex flex-col gap-2 bg-neutral-400/20 p-2 rounded-md flex-shrink">
        {MENU.map((it, index) => (
          <button
            class={`text-lg ${
              page.value == index ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
            } hover:bg-blue-700 hover:scale-105 border-2 border-gray-500 hover:text-white  font-bold py-1 px-2 rounded drop-shadow-md  w-48 `}
            onClick={() => page.value = index}
          >
            {it}
          </button>
        ))}
      </div>
      <div class=" bg-neutral-100/75 border-2 flex-grow border-gray-300 drop-shadow-md rounded-md p-2 min-w-0">        
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
        {page.value === 5 && (
          <Interest config={props.config} data={props.data} />
        )}
        {page.value === 6 && <Matrix config={props.config} data={props.data} />}
      </div>
    </div>
  );
}
