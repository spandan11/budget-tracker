import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  return (
    <div className="relative flex h-screen w-full flex-col">
      <Navbar />
      <div className="w-full">{children}</div>
    </div>
  );
};

export default DashboardLayout;
