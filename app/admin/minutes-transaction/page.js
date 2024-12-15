"use client";
import { useEffect, useState } from 'react';
import useStore from '@/app/store/useStore';  // Assuming useStore hook for dark mode

const AdminGetAllMinutesTransactions = () => {
  const { selectedMode } = useStore();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/getallminutes?date=${selectedDate}`);
        const data = await response.json();

        if (response.ok) {
          setTransactions(data.minutesTransactions || []);
        } else {
          throw new Error(data.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOrders();
  }, [selectedDate]);

  const gradientClass =
    selectedMode === 'dark'
      ? 'bg-gradient-to-b from-gray-800 to-black'
      : 'bg-gradient-to-b from-white to-gray-200';
  const textClass = selectedMode === 'dark' ? 'text-white' : 'text-gray-900';
  const inputClass =
    selectedMode === 'dark'
      ? 'bg-gray-800 text-white border-gray-700'
      : 'bg-white text-gray-800 border-gray-300';
  const cardClass = selectedMode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300';

  // Helper function to format the date manually
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');  // Month is 0-based, so +1
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <div className={`min-h-screen ${gradientClass} ${textClass}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold mb-6">Minutes Transactions</h1>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <label className="block text-sm font-medium">Filter by Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`border rounded-md p-2 w-full sm:w-auto ${inputClass}`}
          />
        </div>

        {error ? (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg shadow-md mb-4">
            <p>Error: {error}</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto shadow-md border-b border-gray-200 rounded-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${inputClass}`}>Done By</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${inputClass}`}>User</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${inputClass}`}>Previous Minutes</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${inputClass}`}>Updated Minutes</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${inputClass}`}>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className={`${cardClass} border-t`}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ${inputClass}`}>
                      {transaction.doneBy?.name || 'Unknown'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${inputClass}`}>
                      {transaction.minutesOfUser?.name || 'Unknown'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${inputClass}`}>
                      {transaction.previousMinutes}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${inputClass}`}>
                      {transaction.updatedMinutes}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${inputClass}`}>
                      {formatDate(transaction.createdAt)} {/* Custom date formatting */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-100 text-gray-700 p-6 rounded-lg shadow-md text-center">
            <p>No minutes transactions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGetAllMinutesTransactions;
