import { Configuration } from "../../data/settings.ts";
import { Transaction } from "../../data/transaction.ts";
import {
  getEndtDate,
  getMonths,
  getStartDate,
  totalAmount,
} from "../../data/aggregators.ts";
import {
  COST,
  filter,
  hasCategory,
  INCOME,
  inMonth,
  inYear,
} from "../../data/filters.ts";
import { toEuro } from "../../data/utils.ts";
import { DEFAULT_CATEGORY } from "../../data/settings.ts";
import format from "$date_fns/format/index.js";

interface Props {
  data: Transaction[];
  config: Configuration;
}

export default function Matrix(props: Props) {
  let year: number | undefined = undefined;
  const categories = [...props.config.categories, DEFAULT_CATEGORY];
  const rows: { title: string; values: number[]; avgRow: boolean }[] = [];
  const months = getMonths(props.data);
  months.reverse().forEach((month) => {
    if (month.getFullYear() != year) {
      year = month.getFullYear();
      rows.push({
        title: "Ø " + format(month, "yyyy", {}),
        avgRow: true,
        values: categories.map((category) => {
          const data = filter(
            props.data,
            inYear(month.getFullYear()),
            hasCategory(category),
          );
          const monthCount = months.filter((it) =>
            it.getFullYear() == month.getFullYear()
          ).length;
          return totalAmount(data) / monthCount;
        }),
      });
    }
    rows.push({
      title: format(month, "MM.yyyy", {}),
      avgRow: false,
      values: categories.map((category) =>
        totalAmount(
          filter(props.data, inMonth(month), hasCategory(category)),
        )
      ),
    });
  });
  return (
	<div class="overflow-auto max-h-[75vh]">
      <table class="table-auto text-xs ">
        <thead class="sticky top-0 z-10">
          <tr class="bg-slate-300 border-b-2 border-gray-500 font-bold">
            <td></td>
            {categories.map((category) => (
              <td class="py-1 px-1 text-center">{category.name}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              class={`${
                row.avgRow
                  ? " bg-blue-100 font-bold"
                  : index % 2 == 1
                  ? "bg-neutral-200"
                  : "bg-stone-100"
              } hover:bg-orange-300/50 `}
            >
              <td class="sticky left-0 z-5 bg-slate-300">
                {row.title}
              </td>
              {row.values.map((amount) => (
                <>
                  {amount == 0 ? <td class="text-center">-</td> : (
                    <td
                      class={`${
                        amount >= 0 ? "text-green-600" : "text-red-800"
                      }  w-[10rem] px-1 text-right text-nowrap font-bold`}
                    >
                      {toEuro(
                        amount,
                      )}
                    </td>
                  )}
                </>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
	  </div>
  );
}
