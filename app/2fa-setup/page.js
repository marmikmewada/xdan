

"use server";

import { auth } from "@/auth";
import TwoFAStep from "./2-fa";

export default async function Page() {
  const session = await auth();
  // const { data: session, status } = useSession();

  console.log("🚀 ~ Home ~ session:", session);



  return <TwoFAStep server_session_data={session} />;
}
