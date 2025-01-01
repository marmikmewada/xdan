import Link from 'next/link';
import { auth } from '@/auth';
export default async function StaffDashboard({ params }) {
  const { staff } = params;  // Extract the staff ID from params
  const  session = await auth();
  console.log("session from staff panel ",session);
  const storeId = await session.token.store_id;

  return (
    <div className="min-h-screen bg-gray-100">
     
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <br />
      <br />
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Staff Dashboard</h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {/* Store Box */}
            <Link href={`/admin/locations/${storeId}`} className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {/* Store Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-orange-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">Store</h2>
                    <p className="mt-1 text-sm text-gray-500">Manage bookings</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href={`/admin/orders`} className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {/* Store Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-orange-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
                    <p className="mt-1 text-sm text-gray-500">Manage orders</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href={`/admin/all-bookings`} className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {/* Store Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-orange-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">All Bookings</h2>
                    <p className="mt-1 text-sm text-gray-500">All Bookings</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* User Box */}
            <Link href={`/admin/minus-minutes`} className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {/* User Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-orange-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">Cut minutes</h2>
                    <p className="mt-1 text-sm text-gray-500">Manage Minutes</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href={`/admin/create-user`} className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {/* Store Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-orange-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">Users</h2>
                    <p className="mt-1 text-sm text-gray-500">Create User</p>
                  </div>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </main>
    </div>
  );
}
