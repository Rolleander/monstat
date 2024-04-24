import { useSignal } from "@preact/signals";
import PeriodOverview from "../../components/PeriodOverview.tsx";
import { filter, inYear } from "../../data/filters.ts";
import {
  Configuration
} from "../../data/settings.ts";
import { Transaction } from "../../data/transaction.ts";
import { fixDates } from "../../data/utils.ts";
import { getYears, Pagination } from "../Pagination.tsx";

interface MonthlyProps {
  data: Transaction[];
  config: Configuration;
}

export default function (props: MonthlyProps) {
  fixDates(props.data);
  const years = getYears(props.data);
  const selected = useSignal(years.length - 1);
  const yearData =   filter(props.data, inYear(years[selected.value]));
  return (
    <div class="flex flex-col gap-8">
      <Pagination options={years.map(it=>it.toString())} selected={selected}>
      </Pagination>
      <PeriodOverview config={props.config} data={yearData}/>
    </div>
  );
}
