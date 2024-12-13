'use client';

import { useEffect, useState } from 'react';
import useStore from '@/app/store/useStore'; // Importing useStore for dynamic mode selection

const AdminGetAllUsers = () => {
  const { selectedMode } = useStore(); // Get the selected mode (light or dark)
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

  // Dynamic styling based on selectedMode
  const gradientClass = selectedMode === 'dark' ? 'bg-gradient-to-r from-gray-800 to-black' : 'bg-gradient-to-r from-white to-gray-200';
  const textClass = selectedMode === 'dark' ? 'text-white' : 'text-gray-900';
  const tableContainerClass = selectedMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800';
  const errorClass = selectedMode === 'dark' ? 'text-red-500' : 'text-red-600';
  const tableHeaderClass = selectedMode === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-500';
  const rowHoverClass = selectedMode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const tableBodyClass = selectedMode === 'dark' ? 'bg-gray-800 text-white divide-gray-700' : 'bg-white text-gray-900 divide-gray-200';

  return (
    <div className={`min-h-screen ${gradientClass} ${textClass}`}>
      <br />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-4xl font-semibold mb-8">All Users</h1>

          {error ? (
            <div className={`p-4 rounded-lg shadow-md ${errorClass} bg-red-100 mb-4`}>
              <p>Error: {error}</p>
            </div>
          ) : (
            <div className={`overflow-x-auto ${tableContainerClass} shadow-lg rounded-lg border border-gray-200`}>
              <table className="min-w-full table-auto divide-y">
                <thead className={tableHeaderClass}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Newsletter</th>
                  </tr>
                </thead>
                <tbody className={tableBodyClass}>
                  {users.map((user) => (
                    <tr key={user.id} className={rowHoverClass}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.name} {user.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{user.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{user.selectedMode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
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



// 'use client'

// import { useEffect, useState } from 'react';

// const AdminGetAllUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState(null);

//   // Fetch users on page load
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch('/api/getallusers');
//         const data = await response.json();

//         if (response.ok) {
//           setUsers(data);
//         } else {
//           throw new Error(data.message || 'Failed to fetch users');
//         }
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <h1 className="text-4xl font-semibold text-gray-900 mb-8">All Users</h1>
          
//           {error ? (
//             <div className="text-red-600 mb-4 p-4 bg-red-100 rounded-lg shadow-md">
//               <p>Error: {error}</p>
//             </div>
//           ) : (
//             <div className="overflow-hidden bg-white shadow-lg rounded-lg border border-gray-200">
//               <table className="min-w-full table-auto divide-y divide-gray-200">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Newsletter</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {users.map((user) => (
//                     <tr key={user.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {user.name} {user.lastName}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.selectedMode}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {user.newsletter ? 'Subscribed' : 'Not Subscribed'}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminGetAllUsers;
