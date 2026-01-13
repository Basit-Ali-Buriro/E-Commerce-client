import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronDown,
  Filter,
  AlertCircle,
  Loader
} from "lucide-react";

// In this environment, we'll use a placeholder for the API URL.
// In your actual project, this should be configured in your .env file.
const API = import.meta.env.VITE_API_URL;

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Use the actual useNavigate hook from React Router
  const navigate = useNavigate();

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please check the API connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product logic with custom modal
  const openDeleteModal = (id) => {
    setProductToDelete(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      // Assuming your backend uses _id for the unique identifier
      await axios.delete(`${API}/products/${productToDelete}`);
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting product:", error);
      // You could set an error state here to show a notification to the user
      closeDeleteModal();
    }
  };

  // Navigate to update page
  const handleEdit = (id) => {
    navigate(`/admin/update-product/${id}`);
  };

  // Navigate to add product page
  const handleAddProduct = () => {
    navigate("/admin/create-product");
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "All" || product.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortConfig.key) {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
      }
      return 0;
    });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  // Extract categories from the fetched products
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Conditional rendering for loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Loader className="animate-spin text-blue-500 mr-2" size={24} />
        <span className="text-lg text-gray-600">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-xl shadow-sm border border-red-200 p-6 text-red-600">
        <AlertCircle className="text-red-500 mr-2" size={24} />
        <span className="text-lg">{error}</span>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Products</h2>
          <p className="text-gray-500 mt-1">
            {filteredProducts.length} products found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="text-gray-400" />
              </div>
            </div>

            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition shadow-md"
            >
              <Plus className="text-lg" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th
                className="px-6 py-3 text-left font-medium cursor-pointer"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center gap-1">
                  Product
                  <span className="text-xs">{getSortIndicator("name")}</span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left font-medium cursor-pointer"
                onClick={() => requestSort("category")}
              >
                <div className="flex items-center gap-1">
                  Category
                  <span className="text-xs">
                    {getSortIndicator("category")}
                  </span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left font-medium cursor-pointer"
                onClick={() => requestSort("price")}
              >
                <div className="flex items-center gap-1">
                  Price
                  <span className="text-xs">{getSortIndicator("price")}</span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left font-medium cursor-pointer"
                onClick={() => requestSort("stock")}
              >
                <div className="flex items-center gap-1">
                  Stock
                  <span className="text-xs">{getSortIndicator("stock")}</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image || "https://placehold.co/64x64/E5E7EB/9CA3AF?text=No+Image"} 
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover border"
                    />
                    <div>
                      <div className="font-medium text-gray-800">
                        {product.name}
                      </div>
                      {/* <div className="text-gray-500 text-sm">
                        SKU: {product._id}
                      </div> */}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {product.category}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  ${product.price}
                </td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit product"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(product._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete product"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Custom Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-sm w-full transform transition-all scale-100 opacity-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Products;