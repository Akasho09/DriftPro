import { getServerSession } from "next-auth";
import aksh from "@repo/db/client";
import { authOptions } from "../../../lib/auth";
import RequestsList from "../../../components/RequestsList";

export default async function RequestsHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Please login to view money requests.
      </div>
    );
  }

  const userId = session.user.id;

  const requests = await aksh.requests.findMany({
    where: { OR: [{ fromId: userId }, { toId: userId }] },
    include: { user1: true, user2: true },
    orderBy: { id: "desc" },
  });

  return  <div className="min-h-screen w-full pt-28 flex flex-col items-center">
    <div className="w-full max-w-4xl">
      <RequestsList requests={requests} userId={userId} />
      </div>
  </div>;
}
