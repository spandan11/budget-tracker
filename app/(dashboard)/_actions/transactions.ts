"use server";

import { db } from "@/lib/db";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/Transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  const parsedBody = CreateTransactionSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { amount, category, date, description, type } = parsedBody.data;

  const categoryRow = await db.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("Category not found");
  }

  await db.$transaction([
    //Create user Transaction
    db.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),
    //update month aggregates table
    db.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "EXPENSE" ? amount : 0,
        income: type === "INCOME" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "EXPENSE" ? amount : 0,
        },
        income: {
          increment: type === "INCOME" ? amount : 0,
        },
      },
    }),

    //update year aggregates table
    db.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "EXPENSE" ? amount : 0,
        income: type === "INCOME" ? amount : 0,
      },
      update: {
        expense: {
          increment: type === "EXPENSE" ? amount : 0,
        },
        income: {
          increment: type === "INCOME" ? amount : 0,
        },
      },
    }),
  ]);
}
