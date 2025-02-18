import { PrismaClient } from "@repo/db/client";
const p1 = new PrismaClient();

export default function Home() {
  return (
    <div className="text-3xl font-bold underline">user app</div>
  );
}
