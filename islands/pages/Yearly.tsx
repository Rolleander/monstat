import { useComputed, useSignal } from "@preact/signals";
import PeriodOverview from "../../components/PeriodOverview.tsx";
import { filter, inYear } from "../../data/filters.ts";
import {
Category,
  Configuration
} from "../../data/settings.ts";
import { Transaction } from "../../data/transaction.ts";
import { fixDates } from "../../data/utils.ts";
import { getYears, Pagination } from "../Pagination.tsx";

interface YearlyProps {
  data: Transaction[];
  config: Configuration;
}

export default function (props: YearlyProps) {
  fixDates(props.data);
  const years = getYears(props.data);
  const selected = useSignal(years.length - 1);
  const category = useSignal<Category | undefined>(undefined);
  let lastSelection = selected.value;
  let initialAnimation = category.value === undefined;
  const animate = useComputed(() => {
    const update = lastSelection != selected.value || initialAnimation;
    initialAnimation = false;
    lastSelection = selected.value;
    //needs to stay here
    const cat = category.value;
    return update;
  });
  const yearData =   filter(props.data, inYear(years[selected.value]));
  return (
    <div class="flex flex-col gap-4">
      <Pagination options={years.map(it=>it.toString())} selected={selected}>
      </Pagination>
      <PeriodOverview config={props.config} data={yearData} animate={animate} category={category}/>
    </div>
  );
}
