import { Signal } from "@preact/signals";
import { toEuro } from "../data/utils.ts";

interface SelectionProps {
  selected: Signal<number>;
  options: string[];
  totals: number[];
}

export default function Selection(props: SelectionProps) {
  return (
    <div class="flex flex-row flex-wrap gap-2">
      {props.options.map((it, index) => (
        <button
          class={` ${
            props.selected.value == index ? "bg-blue-400" : "bg-gray-300"
          } 
          hover:bg-gray-400 text-gray-800 text-md py-[0.2rem] px-2 rounded-sm`}
          onClick={() => props.selected.value = index}
        >
          <div class="flex flex-col items-center">
            <div>{it}</div>
            <div class="font-bold text-nowrap">{toEuro(props.totals[index])}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
