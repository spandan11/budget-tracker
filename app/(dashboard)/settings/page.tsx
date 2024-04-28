import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";

const Settings = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const userSetting = await db.userSettings.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!userSetting) {
    await db.userSettings.create({
      data: {
        userId: user.id,
      },
    });
    redirect("/");
    return;
  }

  return (
    <div className="container flex max-w-2xl flex-col items-center justify-between gap-4">
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
