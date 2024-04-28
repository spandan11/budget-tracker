"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { TRANSACTIONTYPE, UserSettings } from "@prisma/client";
import { getCategoriesStatsResponseType } from "@/app/api/user/stats/categories/route";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

type CategoriesStatsProps = {
  userSettings: UserSettings;
  from: Date;
  to: Date;
};

const CategoriesStats = ({ userSettings, from, to }: CategoriesStatsProps) => {
  const statsQuery = useQuery<getCategoriesStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () =>
      fetch(
        `/api/user/stats/categories?from=${DateToUTCDate(
          from
        )}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);
  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isLoading}>
        <CategoriesCard
          formatter={formatter}
          type="INCOME"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isLoading}>
        <CategoriesCard
          formatter={formatter}
          type="EXPENSE"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
};

export default CategoriesStats;

function CategoriesCard({
  type,
  data,
  formatter,
}: {
  type: TRANSACTIONTYPE;
  formatter: Intl.NumberFormat;
  data: getCategoriesStatsResponseType;
}) {
  const filteredData = data.filter((d) => d.type === type);
  const total = filteredData.reduce((acc, d) => acc + (d._sum?.amount || 0), 0);

  return (
    <Card className="h-80 w-full col-span-6">
      <CardHeader>
        <CardTitle className="grid grid-flow justify-between gap-2 text-muted-foreground md:grid-flow-col">
          {type === "INCOME" ? "Incomes" : "Expenses"} by category
        </CardTitle>
      </CardHeader>
      <div className="flex items-center justify-between gap-2">
        {filteredData.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center">
            No data for selected period
            <p className="text-sm text-muted-foreground">
              Try selecting a different periods or try adding new{" "}
              {type === "INCOME" ? "incomes" : "expenses"}
            </p>
          </div>
        )}
        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-4 p-4">
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount / total) * 100;
                return (
                  <div className="flex flex-col gap-2" key={item.category}>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-gray-400">
                        {item.categoryIcon} {item.category}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      <span className="text-sm text-gray-400">
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      indicator={
                        type === "INCOME" ? "bg-emerald-500" : "bg-red-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
