import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonWrapperProps = {
  isLoading: boolean;
  fullwidth?: boolean;
  children: React.ReactNode;
};

const SkeletonWrapper = ({
  isLoading,
  fullwidth = true,
  children,
}: SkeletonWrapperProps) => {
  if (!isLoading) return children;
  return (
    <Skeleton className={cn(fullwidth && "w-full")}>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
};

export default SkeletonWrapper;
