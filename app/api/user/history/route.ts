import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { getDaysInMonth } from "date-fns";
import { Period } from "@/lib/types";
import { db } from "@/lib/db";

const getHistoryDataSchema = z.object({
  timeFrame: z.enum(["MONTH", "YEAR"]),
  month: z.coerce.number().min(0).max(11).default(0),
  year: z.coerce.number().min(2000).max(3000),
});

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const { searchParams } = new URL(request.url);
  const timeFrame = searchParams.get("timeFrame");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const queryParams = getHistoryDataSchema.safeParse({
    timeFrame,
    year,
    month,
  });
  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }
  const data = await getHistoryData(user.id, queryParams.data.timeFrame, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  });
  return Response.json(data);
}

export type getHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;

async function getHistoryData(
  userId: string,
  timeFrame: string,
  period: Period
) {
  switch (timeFrame) {
    case "YEAR":
      return await getYearHistoryData(userId, period.year);

    case "MONTH":
      return await getMonthHistoryData(userId, period.year, period.month);
  }
}

type HistoryData = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
};

async function getYearHistoryData(userId: string, year: number) {
  const result = await db.yearHistory.groupBy({
    by: ["month"],
    where: {
      userId,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        month: "asc",
      },
    ],
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];

  for (let i = 0; i < 12; i++) {
    let expense = 0;
    let income = 0;
    const month = result.find((row) => row.month === i);
    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }
    history.push({
      year,
      month: i,
      expense,
      income,
    });
  }
  return history;
}

async function getMonthHistoryData(
  userId: string,
  year: number,
  month: number
) {
  const result = await db.monthHistory.groupBy({
    by: ["day"],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        day: "asc",
      },
    ],
  });
  if (!result || result.length === 0) return [];
  const history: HistoryData[] = [];
  const daysInMonth = getDaysInMonth(new Date(year, month));
  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0;
    let income = 0;
    const day = result.find((row) => row.day === i);
    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }
    history.push({
      year,
      month,
      day: i,
      expense,
      income,
    });
  }
  return history;
}
