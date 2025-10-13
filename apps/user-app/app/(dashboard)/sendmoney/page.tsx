// NO "use client" here! This is a Server Component.
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { WalletClient } from "../../../components/SendPage";

export default async function SendMoneyPage() {
  const session = await getServerSession(authOptions);

  // Server-side authentication and redirection is handled here.
  if (!session?.user) {
    redirect("/auth/signup");
  }
  if (!session.user.mobile) {
    // You might want to pass a query param here to show an alert/toast on the client:
    redirect("/auth/signup?missing_mobile=true");
  }

  // Render the Client Component, passing no props needed since it handles its own UI.
  return <WalletClient />;
}