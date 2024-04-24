import { useSignal } from "@preact/signals";
import { filter, inMonth } from "../../data/filters.ts";
import {
  Configuration
} from "../../data/settings.ts";
import { Transaction } from "../../data/transaction.ts";
import { fixDates } from "../../data/utils.ts";
import { getMonths, Pagination } from "../Pagination.tsx";
import PeriodOverview from "../../components/PeriodOverview.tsx";

interface MonthlyProps {
  data: Transaction[];
  config: Configuration;
}

export default function (props: MonthlyProps) {
  fixDates(props.data);
  const months = getMonths(props.data);
  const selected = useSignal(months.months.length - 1);
  const selectedMonth = months.months[selected.value];
  const monthData = filter(props.data, inMonth(selectedMonth))
  return (
    <div class="flex flex-col gap-8">
      <Pagination options={months.monthsDisplay} selected={selected}>
      </Pagination>
      <PeriodOverview config={props.config} data={monthData}/>
    </div>
  );
}
