import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Overview from "./_components/Overview";
import { db } from "@/lib/db";
import History from "./_components/History";

const DashboardPage = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const userSettings = await db.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) redirect("/create");
  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <h2 className="text-3xl font-bold">Hello, {user.firstName}! 👋</h2>
          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              type="INCOME"
              trigger={
                <Button
                  variant="outline"
                  className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
                >
                  New Income 🤑
                </Button>
              }
            />
            <CreateTransactionDialog
              type="EXPENSE"
              trigger={
                <Button
                  variant="outline"
                  className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
                >
                  New expense 😤
                </Button>
              }
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
};

export default DashboardPage;
