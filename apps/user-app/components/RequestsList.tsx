"use client";
import toast from "react-hot-toast";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import approveRequest from "../lib/requests/approveRequest";
import rejectRequest from "../lib/requests/rejectRequest";

export default function RequestsList({
  requests,
  userId,
}: {
  requests: any[];
  userId: string;
}) {
  async function handleApprove(id: number) {
    toast.loading("Approving...");
    const res = await approveRequest(id);
    toast.dismiss();
    res.success ? toast.success(res.message) : toast.error(res.message);
  }

  async function handleReject(id: number) {
    toast.loading("Rejecting...");
    const res = await rejectRequest(id);
    toast.dismiss();
    res.success ? toast.success(res.message) : toast.error(res.message);
  }

  function StatusBadge({ status }: { status: string }) {
    const colorMap: Record<string, string> = {
      Approved: "bg-green-100 text-green-600 border-green-300",
      Declined: "bg-red-100 text-red-600 border-red-300",
      Rejected: "bg-red-100 text-red-600 border-red-300",
      Success: "bg-green-100 text-green-600 border-green-300",
      Failed: "bg-red-100 text-red-600 border-red-300",
      Processing: "bg-yellow-100 text-yellow-600 border-yellow-300",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${colorMap[status] || "bg-gray-100 text-gray-600 border-gray-300"}`}
      >
        {status}
      </span>
    );
  }

  return (
    <Card title="Money Request History">
      {requests.length === 0 && (
        <div className="text-center text-gray-500 italic">No requests yet.</div>
      )}

      <div className="space-y-4">
        {requests.map((req) => {
          const isSentByUser = req.fromId === userId;
          const amount = (req.amount / 100).toFixed(2);

          return (
            <div
              key={req.id}
              className="bg-white p-5 border rounded-xl shadow-sm hover:shadow-md transition flex justify-between items-center"
            >
              {/* LEFT */}
              <div>
                <p className="font-semibold text-gray-900">
                  {isSentByUser ? (
                    <>
                      You requested from{" "}
                      <span className="text-indigo-600 font-bold">
                        {req.user2.name || req.user2.mobile}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-indigo-600 font-bold">
                        {req.user1.name || req.user1.mobile}
                      </span>{" "}
                      requested
                    </>
                  )}
                </p>

                <p className="text-sm mt-1 text-gray-700">
                  <span className="text-red-500 font-bold">₹{amount}</span>
                  {!isSentByUser && " from you"}
                </p>
              </div>

              {/* RIGHT */}
              <div>
                {/* Receiver actions */}
                {!isSentByUser && req.status === "Processing" && (
                  <div className="flex gap-2">
                    <Button
                      className="rounded-lg bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApprove(req.id)}
                    >
                      Approve
                    </Button>

                    <Button
                      onClick={() => handleReject(req.id)}
                      className="rounded-lg bg-gradient-to-r from-red-600 via-rose-700 to-purple-700 text-white hover:opacity-90"
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {/* Receiver — Final Status */}
                {!isSentByUser && req.status !== "Processing" && (
                  <StatusBadge
                    status={req.status === "Success" ? "Approved" : "Declined"}
                  />
                )}

                {/* Sender sees only status */}
                {isSentByUser && (
                  <StatusBadge status={req.status} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
