import { useSignal } from "@preact/signals";
import { Transaction } from "../data/transaction.ts";
import { Configuration } from "../data/settings.ts";
import Monthly from "./pages/Monthly.tsx";
import Yearly from "./pages/Yearly.tsx";

interface MenuProps {
  data: Transaction[];
  config: Configuration;
}

const MENU = [
  "Month overview",
  "Year overview",
  "TODO",
  "TODO",
  "TODO",
  "TODO",
  "TODO",
  "TODO",
  "TODO",
  "TODO"
];

export default function (props: MenuProps) {
  const page = useSignal(0);
  return (
    <div class="flex gap-4 w-full items-start" >
      <div class="flex flex-col gap-2 bg-stone-300/50 p-2 rounded-md">
        {MENU.map((it,index) => (
          <button class={`text-lg ${page.value ==index ? "bg-blue-500" : "bg-gray-400"} hover:bg-blue-700 hover:scale-105 text-white font-bold py-1 px-2 rounded  w-40 `}
           onClick={() => page.value = index}
          >{it}</button>
        ))}
      </div>
      <div class="flex-grow p-2">
        {page.value === 0 && <Monthly config={props.config} data={props.data}/>}
        {page.value === 1 && <Yearly config={props.config} data={props.data}/>}
      </div>
    </div>
  );
}
