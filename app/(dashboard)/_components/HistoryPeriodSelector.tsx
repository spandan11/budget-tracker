"use client";

import { useQuery } from "@tanstack/react-query";
import { Period, TimeFrame } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { getHistoryPeriodsResponseType } from "@/app/api/user/history-periods/route";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type HistoryPeriodSelectorProps = {
  period: Period;
  setPeriod: (period: Period) => void;
  timeFrame: TimeFrame;
  setTimeFrame: (timeFrame: TimeFrame) => void;
};

const HistoryPeriodSelector = ({
  period,
  setPeriod,
  timeFrame,
  setTimeFrame,
}: HistoryPeriodSelectorProps) => {
  const historyPeriods = useQuery<getHistoryPeriodsResponseType>({
    queryKey: ["overview", "history", "periods"],
    queryFn: () => fetch("/api/user/history-periods").then((res) => res.json()),
  });
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={historyPeriods.isLoading} fullwidth={false}>
        <Tabs
          value={timeFrame}
          onValueChange={(value) => setTimeFrame(value as TimeFrame)}
        >
          <TabsList>
            <TabsTrigger value="YEAR">Year</TabsTrigger>
            <TabsTrigger value="MONTH">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-wrap items-center gap-2">
        <SkeletonWrapper
          isLoading={historyPeriods.isFetching}
          fullwidth={false}
        >
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriods.data || []}
          />
        </SkeletonWrapper>
        {timeFrame === "MONTH" && (
          <SkeletonWrapper
            isLoading={historyPeriods.isFetching}
            fullwidth={false}
          >
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
};

export default HistoryPeriodSelector;

function YearSelector({
  period,
  setPeriod,
  years,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  years: getHistoryPeriodsResponseType;
}) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({
          month: period.month,
          year: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function MonthSelector({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        setPeriod({
          year: period.year,
          month: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
          const monthStr = new Date(period.year, month, 1).toLocaleString(
            "default",
            { month: "long" }
          );
          return (
            <SelectItem key={month} value={month.toString()}>
              {monthStr}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
