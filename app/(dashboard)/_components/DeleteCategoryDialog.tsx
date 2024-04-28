"use client";

import { ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Category, TRANSACTIONTYPE } from "@prisma/client";
import { DeleteCategory } from "../_actions/categories";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type DeleteCategoryDialogProps = {
  trigger: ReactNode;
  category: Category;
};

const DeleteCategoryDialog = ({
  trigger,
  category,
}: DeleteCategoryDialogProps) => {
  const categoryIdentifier = `${category.name}-${category.type}`;
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: async () => {
      toast.success("Category deleted successfully", {
        id: categoryIdentifier,
      });
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: categoryIdentifier,
      });
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            category.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deleting category...", {
                id: categoryIdentifier,
              });
              deleteMutation.mutate({
                name: category.name,
                type: category.type as TRANSACTIONTYPE,
              });
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCategoryDialog;
