"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function action(data) {
  const dataa = Object.fromEntries(data);
  console.log("🚀 ~ action ~ dataa:", dataa);
  const { email, password } = dataa || {};
  await signIn("credentials", {
    email,
    password,
    redirect: true,
    redirectTo: "/2fa-setup",
  });
  // redirect("/2fa-setup");
}
