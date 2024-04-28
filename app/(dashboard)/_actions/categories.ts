"use server";

import { db } from "@/lib/db";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateCategory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("Bad request");
  }
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { name, icon, type } = parsedBody.data;

  const findDuplicate = await db.category.findFirst({
    where: {
      userId: user.id,
      name,
      type,
    },
  });
  if (findDuplicate) {
    throw new Error("Category with the name already exist");
  }
  const category = await db.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });
  return category;
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("Bad request");
  }
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { name, type } = parsedBody.data;

  const categories = await db.category.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name,
        type,
      },
    },
  });
  return categories;
}
