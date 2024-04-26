import { Signal } from "@preact/signals";
import { toEuro } from "../data/utils.ts";
import { RiBankFill, RiMoneyDollarCircleFill } from "react-icons/ri";
import { Category } from "../data/settings.ts";
import { TYPE_EXPENSES, TYPE_INVEST, TYPE_SAVINGS } from "../data/settings.ts";

interface SelectionProps {
  selected: Signal<Category | undefined>;
  options: {
    category: Category;
    total: number;
  }[];
}

export default function Selection(props: SelectionProps) {
  return (
    <div class="flex flex-row flex-wrap gap-2">
      {props.options.map((it) => (
        <button
          class={` ${
            props.selected.value == it.category
              ? "bg-gray-300  border-2 border-blue-500"
              : "bg-gray-200 border border-gray-300"
          } 
          hover:bg-gray-100 hover:scale-105  text-md py-[0.2rem] px-2 rounded-md`}
          onClick={() => props.selected.value = it.category}
        >
          <div class="flex flex-col items-center">
            <div class="flex items-center gap-1 border-b border-gray-600/10">
              {(it.category.type === TYPE_SAVINGS ||
                it.category.type === TYPE_INVEST) &&
                <RiBankFill color={it.category.color} />}
              {(it.category.type === undefined ||
                it.category.type === TYPE_EXPENSES) &&
                <RiMoneyDollarCircleFill color={it.category.color} />}
              {it.category.name}
            </div>
            <div
              class={` ${
                (it.category.type === TYPE_SAVINGS ||
                    it.category.type === TYPE_INVEST)
                  ? "text-gray-600"
                  : (
                    it.total >= 0 ? "text-green-600" : "text-red-800"
                  )
              } font-bold text-nowrap`}
            >
              {toEuro(it.total)}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
