"use client";

import React, { ReactNode, useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleOff, Loader2, PlusSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/categories";
import { cn } from "@/lib/utils";
import { Category, TRANSACTIONTYPE } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategory } from "../_actions/categories";
import { toast } from "sonner";
import { useTheme } from "next-themes";

type CreateCategoryDialogProps = {
  type: TRANSACTIONTYPE;
  SuccessCallback: (category: Category) => void;
  trigger?: ReactNode;
};

const CreateCategoryDialog = ({
  type,
  SuccessCallback,
  trigger,
}: CreateCategoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      type,
    },
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: "",
        icon: "",
        type,
      });

      toast.success(`Category ${data.name} created Successfully 🎉`, {
        id: "create-category",
      });

      SuccessCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setOpen(false);
    },
    onError: (e) => {
      toast.error(e.message, {
        id: "create-category",
      });
    },
  });

  const onSubmit = useCallback(
    (values: CreateCategorySchemaType) => {
      toast.loading("Creating Category...", {
        id: "create-category",
      });
      mutate(values);
    },
    [mutate]
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="ghost"
            className="flex border-separate items-center justify-start text-muted-foreground rounded-none border-b px-3 py-3"
          >
            <PlusSquare className="w-4 h-4 mr-2" />
            Create New
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create{" "}
            <span
              className={cn(
                "m-1",
                type === "INCOME" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type.toLowerCase()}
            </span>
            Category
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Category..."
                      defaultValue={""}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-[100px] w-full">
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Click to change
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="h-[48px] w-[48px] text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                Click to select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          data={data}
                          theme={theme.resolvedTheme}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {!isPending && "Create"}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
