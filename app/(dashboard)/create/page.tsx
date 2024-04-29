"use client";

import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Settings = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();
  if (!isSignedIn) router.push("/sign-in");

  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user/settings").then((res) => res.json()),
  });

  if (userSettings && userSettings.data && userSettings.isFetched) {
    router.push("/");
    return;
  }

  // useEffect(() => {
  //   if (isSignedIn) {
  //     userSettings
  //   }
  // }, [isSignedIn]);

  return (
    <div className="container flex max-w-2xl flex-col items-center justify-between gap-4">
      {userSettings.isFetching ? "Fetching...." : "not fetching"}
      <Separator />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your default currency for transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyComboBox />
        </CardContent>
      </Card>
      <Separator />
    </div>
  );
};

export default Settings;
