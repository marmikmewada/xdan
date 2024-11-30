'use client'

import { useEffect, useState } from 'react';

const AdminGetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch users on page load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/getallusers');
        const data = await response.json();

        if (response.ok) {
          setUsers(data);
        } else {
          throw new Error(data.message || 'Failed to fetch users');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-4xl font-semibold text-gray-900 mb-8">All Users</h1>
          
          {error ? (
            <div className="text-red-600 mb-4 p-4 bg-red-100 rounded-lg shadow-md">
              <p>Error: {error}</p>
            </div>
          ) : (
            <div className="overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200">
              <table className="min-w-full table-auto divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Newsletter</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name} {user.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.selectedMode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.newsletter ? 'Subscribed' : 'Not Subscribed'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminGetAllUsers;
