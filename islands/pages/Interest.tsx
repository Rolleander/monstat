import addMonths from "$date_fns/addMonths/index.ts";
import addYears from "$date_fns/addYears/index.ts";
import format from "$date_fns/format/index.js";
import { Signal, useSignal } from "@preact/signals";
import {
	getEndtDate,
	getStartDate,
	totalAmount
} from "../../data/aggregators.ts";
import {
	filter,
	hasCategory,
	inMonth,
	inYear
} from "../../data/filters.ts";
import {
	Category,
	Configuration,
	TYPE_INVEST,
	TYPE_SAVINGS
} from "../../data/settings.ts";
import { Transaction } from "../../data/transaction.ts";
import { fixDates, round, toEuro } from "../../data/utils.ts";
import Chart from "../../islands/Chart.tsx";
import Selection from "../Selection.tsx";

interface Props {
  data: Transaction[];
  config: Configuration;
}

const INTERESTS = [
  0.005,
  0.01,
  0.015,
  0.02,
  0.025,
  0.03,
  0.035,
  0.04,
  0.045,
  0.05,
  0.055,
  0.06,
];
const YEARS = 30;
const GROWTH_TYPES = [
  0,
  0.1,
  0.25,
  0.5,
  0.75,
  0.9,
  1,
  1.1,
  1.25,
  1.5,
];

export default function Interest(props: Props) {
  fixDates(props.data);
  const start = getStartDate(props.data);
  const end = getEndtDate(props.data);
  const categories = props.config.categories.filter((it) =>
    it.type == TYPE_INVEST || it.type == TYPE_SAVINGS
  );
  const category = useSignal<Category | undefined>(categories[0]);
  const growth = useSignal(6);
  const years = [start];
  for (let i = 1; i <= YEARS + (end.getFullYear() - start.getFullYear()); i++) {
    years.push(addYears(start, i));
  }
  let lastYearGrowth = 0;
  if (category.value) {
    for (let i = 0; i < 12; i++) {
      lastYearGrowth += totalAmount(
        filter(
          props.data,
          hasCategory(category.value),
          inMonth(addMonths(end, i * -1)),
        ),
      ) * -1;
    }
  }
  return (
    <div class="flex flex-col gap-2 ">
      <Selection
        options={categories.map((it) => ({ category: it }))}
        selected={category}
      />

      {category.value &&
        (
          <div class="text-sm flex flex-col items-center gap-2">
            <div class="text-green-700">
              <span class="font-bold mr-1">{toEuro(lastYearGrowth)}</span>{" "}
              was invested in the last 12 months
            </div>
            <div class="flex flex-col items-center rounded-md border-2 border-blue-300 p-2 gap-2">
              <span class="text-gray-800">
                Predicting growth over {YEARS} years with interest, assuming yearly continous investments of:
              </span>
              <GrowthSelection
                selected={growth}
                options={GROWTH_TYPES.map((it) => toEuro(lastYearGrowth * it))}
              />
            </div>
            <InterestChart
              futureGrowth={lastYearGrowth * GROWTH_TYPES[growth.value]}
              endDate={end}
              years={years}
              config={props.config}
              data={filter(props.data, hasCategory(category.value))}
            />
          </div>
        )}
    </div>
  );
}

function GrowthSelection(
  props: { options: string[]; selected: Signal<number> },
) {
  return (
    <div class="flex gap-2">
      {props.options.map((it, index) => (
        <div class="flex flex-col items-center">
          <div class="text-blue-500">
            {round(GROWTH_TYPES[index] * 100,0)} %
          </div>
          <button
            class={` ${
              index == props.selected.value
                ? "border-2 border-orange-300  "
                : "text-gray-500"
            } px-1 rounded-sm hover:bg-slate-100 `}
            onClick={() => props.selected.value = index}
          >
            {it}
          </button>
        </div>
      ))}
    </div>
  );
}

interface InterestChartProps {
  futureGrowth: number;
  endDate: Date;
  data: Transaction[];
  years: Date[];
  config: Configuration;
}

function calcInterests(
  interest: number,
  years: Date[],
  data: Transaction[],
  futureGrowth = 0,
  endDate: Date,
) {
  let sum = 0;
  return years.map((year, index) => {
    let total = totalAmount(filter(data, inYear(year.getFullYear() - 1))) * -1;
    if (year.getFullYear() >= endDate.getFullYear()) {
      total = Math.max(total, futureGrowth);
    }
    sum += total;
    sum = sum * (1 + interest);
    return sum;
  });
}

function InterestChart(props: InterestChartProps) {
  const interests = new Map<number, number[]>(
    INTERESTS.map((
      interest,
    ) => [
      interest,
      calcInterests(
        interest,
        props.years,
        props.data,
        props.futureGrowth,
        props.endDate,
      ),
    ]),
  );
  return (
    <Chart
      type="line"
      options={{
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
            display: true,
          },
          zoom: {
            pan: {
              enabled: true,
              mode: "x",
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "x",
            },
          },
        },
      }}
      data={{
        labels: props.years.map((it) => format(it, "yyyy", {})),
        datasets: Array.from(interests.keys()).map((interest) => ({
          label: round(interest * 100, 1) + " %",
          data: interests.get(interest)!.map((it) => Math.abs(it)),
          pointStyle: false,
        })),
      }}
    />
  );
}
