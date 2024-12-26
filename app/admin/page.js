"use client";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardIcon = ({ children }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-white hover:text-orange-500 transition-colors duration-300">
    {children}
  </svg>
);

const AssignCategoryIcon = () => (
  <DashboardIcon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </DashboardIcon>
);

const GetAllUsers = () => (
  <DashboardIcon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </DashboardIcon>
);

const ProductIcon = () => (
  <DashboardIcon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </DashboardIcon>
);

const PackageIcon = () => (
  <DashboardIcon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </DashboardIcon>
);

const LocationIcon = () => (
  <DashboardIcon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </DashboardIcon>
);

const OrderIcon = () => (
  <DashboardIcon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </DashboardIcon>
);

const CategoryIcon = () => (
  <DashboardIcon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </DashboardIcon>
);

const CouponIcon = () => (
  <DashboardIcon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </DashboardIcon>
);

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { user } = session || {};
  const { role } = user || {};

  useEffect(() => {
    if (status !== "loading" && role !== "admin") {
      router.back();
    }
  }, [role, router, status]);

  const dashboardItems = [
    { title: 'Products', url: '/admin/products', icon: <ProductIcon /> },
    { title: 'Packages', url: '/admin/packages', icon: <PackageIcon /> },
    { title: 'Locations', url: '/admin/locations', icon: <LocationIcon /> },
    { title: 'Orders', url: '/admin/orders', icon: <OrderIcon /> },
    // { title: 'Categories', url: '/admin/categories', icon: <CategoryIcon /> },
    { title: 'All Bookings', url: '/admin/all-bookings', icon: <DashboardIcon><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z" /></DashboardIcon> },
    { title: 'Coupons', url: '/admin/coupons', icon: <CouponIcon /> },
    { title: 'Assign Staff', url: '/admin/assignstaff', icon: <DashboardIcon><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12h-2v1a3 3 0 01-6 0v-1H5m14-5H5m14 0h-2m-2 0h-6a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2z" /></DashboardIcon> },
    // { title: 'Assign Category', url: '/admin/assigncategory', icon: <AssignCategoryIcon /> },
    { title: 'All Users', url: '/admin/getallusers', icon: <DashboardIcon><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z" /></DashboardIcon> },
    { title: 'Minus minutes', url: '/admin/minus-minutes', icon: <DashboardIcon><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z" /></DashboardIcon> },
    { title: 'Beds', url: '/admin/beds', icon: <DashboardIcon><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z" /></DashboardIcon> },
    { title: 'orders Transections', url: '/admin/orders-transection', icon: <DashboardIcon><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z" /></DashboardIcon> },
    { title: 'Minutes Transections', url: '/admin/minutes-transaction', icon: <DashboardIcon><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z" /></DashboardIcon> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-black text-white">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <br />
        <br />
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {dashboardItems.map((item) => (
              <Link key={item.title} href={item.url}>
                <div className="bg-gradient-to-r from-black to-gray-500 overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-semibold">{item.title}</h2>
                        <p className="mt-1 text-sm text-gray-400">Manage {item.title.toLowerCase()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}


