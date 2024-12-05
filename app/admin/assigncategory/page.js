'use client';

import { useState, useEffect } from 'react';
import useStore from '@/app/store/useStore'; // Import useStore

export default function AssignCategoryPage() {
  // Get the selectedMode from the store
  const { selectedMode } = useStore();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  // Fetch categories and products on mount
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        // Fetch categories and products from the API
        const response = await fetch('/api/getassigncat');
        const data = await response.json();

        if (response.ok) {
          setCategories(data.categories);
          setProducts(data.products);
        } else {
          alert(data.message || 'Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data');
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  const handleAssignCategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !selectedProduct) {
      alert('Please select both a category and a product.');
      return;
    }

    try {
      // Call API to assign category to product
      const response = await fetch('/api/getassigncat/postassigncat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct,
          categoryId: selectedCategory,
        }),
      });

      const data = await response.json();
      if (response.status === 200) {
        // alert(data.message);
      } else {
        // alert(data.message || 'Failed to assign category');
      }
    } catch (error) {
      console.error('Error assigning category:', error);
      alert('Failed to assign category');
    }
  };

  // Dynamic gradient and styles based on selectedMode from store
  const gradientClass = selectedMode === 'dark' ? 'bg-gradient-to-r from-gray-800 to-black' : 'bg-gradient-to-r from-white to-gray-200';
  const textClass = selectedMode === 'dark' ? 'text-white' : 'text-black';
  const inputClass = selectedMode === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-400';
  const selectClass = selectedMode === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-400';
  const buttonClass = selectedMode === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-blue-500' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';

  return (
    <div className={`min-h-screen ${gradientClass} ${textClass}`}>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <br />
        <br />
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-center mb-6">Assign Category to Product</h1>
          <form onSubmit={handleAssignCategory} className="space-y-6">
            <div>
              <label htmlFor="product" className="block text-sm font-medium">
                Product
              </label>
              <select
                id="product"
                name="product"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className={`mt-1 block w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClass}`}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`mt-1 block w-full p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClass}`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className={`mt-4 px-6 py-3 rounded-md font-semibold focus:ring-2 ${buttonClass}`}
            >
              Assign Category
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}


// 'use client';

// import { useState, useEffect } from 'react';

// export default function AssignCategoryPage() {
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedProduct, setSelectedProduct] = useState('');

//   // Fetch categories and products on mount
//   useEffect(() => {
//     const fetchCategoriesAndProducts = async () => {
//       try {
//         // Fetch categories and products from the API
//         const response = await fetch('/api/getassigncat');
//         const data = await response.json();

//         if (response.ok) {
//           setCategories(data.categories);
//           setProducts(data.products);
//         } else {
//           alert(data.message || 'Failed to fetch data');
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         alert('Failed to fetch data');
//       }
//     };

//     fetchCategoriesAndProducts();
//   }, []);

//   const handleAssignCategory = async (e) => {
//     e.preventDefault();
//     if (!selectedCategory || !selectedProduct) {
//       alert('Please select both a category and a product.');
//       return;
//     }

//     try {
//       // Call API to assign category to product
//       const response = await fetch('/api/getassigncat/postassigncat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           productId: selectedProduct,
//           categoryId: selectedCategory,
//         }),
//       });

//       const data = await response.json();
//       if (response.status === 200) {
//         // alert(data.message);
//       } else {
//         // alert(data.message || 'Failed to assign category');
//       }
//     } catch (error) {
//       console.error('Error assigning category:', error);
//       alert('Failed to assign category');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <h1 className="text-3xl font-bold text-gray-900 mb-6">Assign Category to Product</h1>
//           <form onSubmit={handleAssignCategory} className="space-y-4">
//             <div>
//               <label htmlFor="product" className="block text-sm font-medium text-gray-700">
//                 Product
//               </label>
//               <select
//                 id="product"
//                 name="product"
//                 value={selectedProduct}
//                 onChange={(e) => setSelectedProduct(e.target.value)}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               >
//                 <option value="">Select a product</option>
//                 {products.map((product) => (
//                   <option key={product.id} value={product.id}>
//                     {product.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label htmlFor="category" className="block text-sm font-medium text-gray-700">
//                 Category
//               </label>
//               <select
//                 id="category"
//                 name="category"
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               >
//                 <option value="">Select a category</option>
//                 {categories.map((category) => (
//                   <option key={category.id} value={category.id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <button
//               type="submit"
//               className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
//             >
//               Assign Category
//             </button>
//           </form>
//         </div>
//       </main>
//     </div>
//   );
// }
