import { useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { filter, inMonth } from "../../data/filters.ts";
import { Category, Configuration } from "../../data/settings.ts";
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
  const selectedMonth = months.months[selected.value];
  const monthData = filter(props.data, inMonth(selectedMonth));
  return (
    <div class="flex flex-col gap-8">
      <Pagination options={months.monthsDisplay} selected={selected}>
      </Pagination>
      <PeriodOverview
        config={props.config}
        data={monthData}
        category={category}
        animate={animate}
      />
    </div>
  );
}
