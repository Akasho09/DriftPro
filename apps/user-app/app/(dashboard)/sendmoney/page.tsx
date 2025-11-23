import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { WalletClient } from "../../../components/SendPage";

export default async function SendMoneyPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signup");
  }
  if (!session.user.mobile) {
    redirect("/auth/signup?missing_mobile=true");
  }

  return <WalletClient />;
}