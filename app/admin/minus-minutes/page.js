"use client";

import { useState, useEffect } from "react";

export default function UserDetailsTable() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null); // Track the index of the row being edited
  const [loading, setLoading] = useState(false);

  // Fetch users data
  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetch(`/api/getallusers`).then((res) => res.json());
      setUsers(userData);
    };
    fetchData();
  }, [baseUrl]);

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Handle update minutes
  const handleUpdateMinutes = async (id, newMinutes) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/update-minutes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minutes: newMinutes,userId:id }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, minutes: updatedUser.data.minutes } : user
          )
        );
        console.log("Minutes updated successfully!");
      } else {
        const errorData = await response.json();
        console.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating minutes:", error);
    } finally {
      setLoading(false);
      setEditIndex(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">User Details</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2 text-left">Email</th>
              <th className="border border-gray-300 p-2 text-left">Minutes</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2">
                    {editIndex === index ? (
                      <input
                        type="number"
                        className="w-20 p-1 border border-gray-300 rounded"
                        value={user.minutes}
                        onChange={(e) =>
                          setUsers((prevUsers) =>
                            prevUsers.map((u, i) =>
                              i === index ? { ...u, minutes: e.target.value } : u
                            )
                          )
                        }
                      />
                    ) : (
                      user.minutes
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {editIndex === index ? (
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                        onClick={() => handleUpdateMinutes(user.id, Number(user.minutes))}
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Save"}
                      </button>
                    ) : (
                      <button
                        className="bg-blue-500  px-3 py-1 rounded"
                        onClick={() => setEditIndex(index)}
                      >
                        Edit
                      </button>
                    )}
                    {editIndex === index && (
                      <button
                        className="bg-gray-500 text-white px-3 py-1 rounded ml-2"
                        onClick={() => setEditIndex(null)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="border border-gray-300 p-2 text-center text-gray-500"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
