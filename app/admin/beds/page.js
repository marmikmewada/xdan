"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BedList() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBeds = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/api/bed`);
        const data = await response.json();
        setBeds(data?.data || []);
      } catch (error) {
        console.error("Error fetching beds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeds();
  }, [baseUrl]);

  const handleDelete = async (bedId) => {
    if (!confirm("Are you sure you want to delete this bed?")) return;

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/bed/${bedId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setBeds(beds.filter((bed) => bed._id !== bedId));
      } else {
        alert("Failed to delete the bed.");
      }
    } catch (error) {
      console.error("Error deleting bed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <br />
      <br />
      <br />
      <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">List of Beds</h1>
          <button
            onClick={() => router.push("/admin/beds/create")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add New Bed
          </button>
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Store</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {beds.map((bed) => {
              console.log("bed",bed)
              const {storeRef}=bed||{}
              return(
              <tr key={bed._id}>
                <td className="border px-4 py-2">{bed.bedName}</td>
                <td className="border px-4 py-2">
                  {storeRef?.length>0?storeRef.map((store,index)=>{
                    return(
                    <span key={index}>{store?.name}</span>
                    )
                  }):
                   "No Store Assigned"}
                </td>
                <td className="border px-4 py-2 space-x-4">
                  <button
                    onClick={() => handleDelete(bed._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </main>
  );
}
