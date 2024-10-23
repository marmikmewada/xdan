// app/components/UserProfile.js

import { auth } from '@/auth'; // Adjust the import based on your setup
import { redirect } from 'next/navigation';

export default async function UserProfile() {
  // Fetch the session
  const session = await auth();
  console.log(session);

  // If there is no session, redirect to login
  if (!session) {
    redirect('/login');
  }

  // Destructure user info from session
  const { user } = session;

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {/* Add more user information if needed */}
    </div>
  );
}
