import { db } from "@/lib/db";
import type { WebhookEvent } from "@clerk/nextjs/server";

const handler = async (req: any) => {
  const evt = req.body.evt as WebhookEvent;
  switch (evt.type) {
    case "user.created":
      return await db.userSettings.create({
        data: {
          userId: evt.data.id,
        },
      });
  }
};

export { handler as GET, handler as POST };
