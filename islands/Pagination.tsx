import { Signal } from "@preact/signals";
import { Transaction } from "../data/transaction.ts";
import { getStartDate } from "../data/aggregators.ts";
import { getEndtDate } from "../data/aggregators.ts";
import format from "$date_fns/format/index.js";
import {
  RiArrowLeftFill,
  RiArrowRightFill,
  RiSkipBackFill,
  RiSkipForwardFill,
} from "react-icons/ri";

const MAX_OPTIONS = 9;
const CENTER_INDEX = Math.floor(MAX_OPTIONS / 2);
const MONTH_FORMAT = "MM.yyyy";

interface PaginationProps {
  selected: Signal<number>;
  options: string[];
}

export function toMonth(date: Date) {
  return format(date, MONTH_FORMAT, {});
}

export function getMonths(data: Transaction[]) {
  const start = getStartDate(data);
  const end = getEndtDate(data);
  const monthsDisplay = [];
  const months = [];
  let m = start.getMonth();
  let y = start.getFullYear();
  let date: Date;
  const endMonth = end.getFullYear() * 12 + end.getMonth();
  do {
    date = new Date(y, m+1, 1);
    months.push(date);
    monthsDisplay.push(toMonth(date));
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  } while (date.getFullYear() * 12 + date.getMonth() < endMonth);
  return {
    months,
    monthsDisplay,
  };
}

export function getYears(data: Transaction[]) {
  const start = getStartDate(data);
  const end = getEndtDate(data);
  const diff = (end.getFullYear() - start.getFullYear()) + 1;
  const years = [];
  for (let i = 0; i < diff; i++) {
    years.push(start.getFullYear() + i);
  }
  return years;
}

export function Pagination(props: PaginationProps) {
  const current = props.selected.value;
  const showOptions = new Map<string, number>();
  let shift = 0;
  if (current < CENTER_INDEX) {
    shift = CENTER_INDEX - current;
  } else if (current > (props.options.length - 1) - CENTER_INDEX) {
    shift -= CENTER_INDEX - ((props.options.length - 1) - current);
  }
  let selectedOptionIndex = -1;
  for (let i = 0; i < MAX_OPTIONS; i++) {
    let oi = current + i - CENTER_INDEX + shift;
    oi = Math.max(oi, 0);
    oi = Math.min(oi, props.options.length - 1);
    if (!showOptions.has(props.options[oi])) {
      showOptions.set(props.options[oi], oi);
    }
    if (oi == current && selectedOptionIndex === -1) {
      selectedOptionIndex = i;
    }
  }
  const paginatingLeft = current > 0;
  const paginatingRight = current < props.options.length - 1;
  return (
    <div class="inline-flex">
      <button
        disabled={!paginatingLeft}
        class={` ${
          paginatingLeft ? "bg-gray-300 hover:bg-gray-400" : "invisible"
        }   text-gray-800 font-bold py-1 px-2 rounded-l`}
        onClick={() => props.selected.value = 0}
      >
        <RiSkipBackFill />
      </button>

      <button
        disabled={!paginatingLeft}
        class={` ${
          paginatingLeft ? "bg-gray-300 hover:bg-gray-400" : "invisible"
        }   text-gray-800 font-bold py-1 px-2`}
        onClick={() => props.selected.value -= 1}
      >
        <RiArrowLeftFill />
      </button>

      {Array.from(showOptions.entries()).map((entry, index) => (
        <button
          class={` ${
            selectedOptionIndex == index ? "bg-blue-400" : "bg-gray-300"
          } 
          hover:bg-gray-400 text-gray-800 font-bold py-1 px-4 `}
          onClick={() => props.selected.value = entry[1]}
        >
          {entry[0]}
        </button>
      ))}

      <button
        class={` ${
          paginatingRight ? "bg-gray-300 hover:bg-gray-400" : "invisible"
        }   text-gray-800 font-bold py-1 px-2 `}
        disabled={!paginatingRight}
        onClick={() => props.selected.value += 1}
      >
        <RiArrowRightFill />
      </button>
      <button
        class={` ${
          paginatingRight ? "bg-gray-300 hover:bg-gray-400" : "invisible"
        }   text-gray-800 font-bold py-1 px-2 rounded-r`}
        disabled={!paginatingRight}
        onClick={() => props.selected.value = props.options.length - 1}
      >
        <RiSkipForwardFill />
      </button>
    </div>
  );
}
