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
import StackedLineChart from "../../components/charts/StackedLineChart.tsx";

interface ExpensesProps {
  data: Transaction[];
  config: Configuration;
}

export default function (props: ExpensesProps) {
  fixDates(props.data);
  return (
    <StackedLineChart config={props.config} data={props.data}  /> 
  );
}
