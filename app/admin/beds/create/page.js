"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageKit from "imagekit";
import { X } from "lucide-react";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT,
});

export default function CreateBed() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [name, setName] = useState("");
  const [storeRef, setStoreRef] = useState([]);
  const [stores, setStores] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/store`);
        const data = await response.json();
        setStores(data?.data || []);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, [baseUrl]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setIsLoading(true);

    try {
      const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async (event) => {
            try {
              const result = await imagekit.upload({
                file: event.target.result,
                fileName: file.name,
                folder: `dan-studio/beds`,
              });
              if (result.url) {
                resolve(result.url);
              } else {
                reject(new Error("Failed to upload image to ImageKit"));
              }
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      });

      const imageUrls = await Promise.all(uploadPromises);
      setImageUrl((prevImageUrl) => [...prevImageUrl, ...imageUrls]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageUrl((prevImageUrl) => prevImageUrl.filter((_, index) => index !== indexToRemove));
  };

  const handleCreate = async () => {
    if (!name || storeRef.length === 0) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/bed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bedName:name, storeRef, imageUrl }),
      });
      const result = await response.json();

      if (result.success) {
        router.push("/admin/beds");
      } else {
        console.log("Failed to create the bed.");
      }
    } catch (error) {
      console.error("Error creating bed:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <br />
      <br />
      <div className="max-w-lg mx-auto bg-white p-6 shadow-lg rounded-md">
        <h1 className="text-2xl font-bold mb-4">Create New Bed</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium">Bed Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
  <label className="block text-sm font-medium">Assign to Store</label>
  <div className="mt-2 space-y-2">
    {stores.map((store) => (
      <div key={store._id} className="flex items-center space-x-3">
        <input
          type="checkbox"
          id={`store-${store._id}`}
          value={store._id}
          checked={storeRef.includes(store._id)}
          onChange={(e) => {
            const storeId = e.target.value;
            if (e.target.checked) {
              setStoreRef((prev) => [...prev, storeId]);
            } else {
              setStoreRef((prev) => prev.filter((id) => id !== storeId));
            }
          }}
          className="w-4 h-4 border-gray-300 rounded"
        />
        <label
          htmlFor={`store-${store._id}`}
          className="text-sm font-medium text-gray-700"
        >
          {store.name}
        </label>
      </div>
    ))}
  </div>
</div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Images</label>
          <input
            type="file"
            onChange={handleImageUpload}
            multiple
            accept="image/*"
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          />
          {imageUrl.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {imageUrl.map((url, index) => (
                <div key={index} className="relative h-32 w-full">
                  <Image
                    src={url}
                    alt={`Bed image ${index + 1}`}
                    fill
                    className="rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleCreate}
          className="w-full bg-blue-500 text-white py-2 rounded-md"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Bed"}
        </button>
      </div>
    </main>
  );
}
