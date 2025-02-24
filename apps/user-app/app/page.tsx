import { PrismaClient } from '@repo/db/client';
const alask = new PrismaClient();
import {Topbar} from '@repo/ui/topbar';

export default function Home() {
  return (
    <div className="">
    <Topbar></Topbar>
    user app
    </div>
  );
}
