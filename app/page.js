"use client";
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  console.log("🚀 ~ Home ~ session:", session);

  // If session is loading, you can show a loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You are not logged in.</div>;
  }

  return <div>Welcome, {session.user.name}</div>;
}
