"use client";
import { useUser } from "@clerk/nextjs";
import { UserSettings } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Settings = async () => {
  const { isSignedIn } = useUser();
  const router = useRouter();
  if (!isSignedIn) router.push("/sign-in");

  const { isLoading, isError, data, isSuccess } = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user/settings").then((res) => res.json()),
  });

  useEffect(() => {
    if (!isLoading && !isError && data) {
      // Assuming response.data contains user settings
      // Check if user settings are filled
      if (data && data.currency && isSuccess) {
        // Redirect to home page if user settings are filled
        router.push("/");
      }
      router.refresh();
    }
  }, [isLoading, isError, data, router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
      Making things work...
    </div>
  );
};

export default Settings;
