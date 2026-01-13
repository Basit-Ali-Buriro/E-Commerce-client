import { useState } from "react";
import {
  FiBox,
  FiDollarSign,
  FiTag,
  FiGrid,
  FiImage,
  FiPlus,
  FiMinus,
  FiSave,
  FiX,
  FiChevronDown, // Import FiChevronDown
} from "react-icons/fi";
import axios from "axios";

// This is a placeholder for your environment variable.
// In a real project, this would be defined in a .env file.
const API = import.meta.env.VITE_API_URL;

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "men",
    brand: "",
    tags: "",
    sizes: [{ size: "M", stock: 10 }],
    image: null, // Change to null to represent no file selected initially
    galleryImages: [], // Now stores the actual File objects
    details: {
      material: "",
      careInstructions: "",
      closure: "",
      fit: "",
      color: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("basic");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("details.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        details: {
          ...prev.details,
          [key]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (isNaN(Number(formData.price))) newErrors.price = "Price must be a number"; // Use Number() to correctly validate
    if (!formData.image) newErrors.image = "Main image is required";
    if (!formData.category) newErrors.category = "Category is required";

    // Validate stock
    formData.sizes.forEach((size, index) => {
      if (size.stock === "" || isNaN(Number(size.stock))) {
        newErrors[`size-${index}`] = "Stock must be a number";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);

      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", Number(formData.price));
      payload.append(
        "originalPrice",
        formData.originalPrice ? Number(formData.originalPrice) : 0
      );
      payload.append(
        "discountPercent",
        formData.originalPrice && formData.price
          ? Math.round(
              ((Number(formData.originalPrice) - Number(formData.price)) /
                Number(formData.originalPrice)) *
                100
            )
          : 0
      );
      payload.append("category", formData.category);
      payload.append("brand", formData.brand);
      payload.append(
        "tags",
        JSON.stringify(
          formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        )
      );
      payload.append("sizes", JSON.stringify(formData.sizes));
      payload.append("details", JSON.stringify(formData.details));

      // Append files
      payload.append("image", formData.image); // This is now the actual file object
      formData.galleryImages.forEach((file) => {
        payload.append("images", file);
      });

      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const token = adminInfo?.token;

      try {
        const res = await axios.post(`${API}/products`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        alert("✅ Product created successfully!");
        console.log(res.data);
        // Reset form after success
        setFormData({
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          category: "men",
          brand: "",
          tags: "",
          sizes: [{ size: "M", stock: 10 }],
          image: null,
          galleryImages: [],
          details: {
            material: "",
            careInstructions: "",
            closure: "",
            fit: "",
            color: "",
          },
        });
      } catch (err) {
        console.error(err);
        alert(
          `Failed to create product: ${
            err.response?.data?.message || err.message
          }`
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index] = { ...updatedSizes[index], [field]: value };
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const addSize = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: "M", stock: 10 }],
    });
  };

  const removeSize = (index) => {
    if (formData.sizes.length > 1) {
      const updatedSizes = formData.sizes.filter((_, i) => i !== index);
      setFormData({ ...formData, sizes: updatedSizes });
    }
  };

  // New handler for main image upload
  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
    // Clear image error when a file is selected
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  // New handler for gallery image upload
  const handleGalleryImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, ...files],
    }));
  };

  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  // Function to create a URL for a file
  const getImageUrl = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return file; // In case the file is already a URL string
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md mt-6 border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiBox className="text-blue-600" />
          Create New Product
        </h2>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "basic"
                ? "bg-blue-100 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            type="button" // Change to type="button"
            onClick={() => setActiveTab("basic")}
          >
            Basic Info
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "details"
                ? "bg-blue-100 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            type="button" // Change to type="button"
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "media"
                ? "bg-blue-100 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            type="button" // Change to type="button"
            onClick={() => setActiveTab("media")}
          >
            Media
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-b-2 focus:border-blue-500 focus:outline-none peer ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder=" "
                />
                <label className="absolute left-0 -top-3.5 text-sm text-gray-600 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-500">
                  Product Name
                </label>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 border-b-2 focus:border-blue-500 focus:outline-none peer resize-none ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder=" "
                ></textarea>
                <label className="absolute left-0 -top-3.5 text-sm text-gray-600 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-500">
                  Product Description
                </label>
              </div>
            </div>

            {/* Price & Original Price */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <FiDollarSign className="text-gray-400 absolute left-3 top-4" />
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full pl-8 pr-4 py-3 border-b-2 focus:border-blue-500 focus:outline-none ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Price"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-xs text-red-500">{errors.price}</p>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center gap-2">
                <FiDollarSign className="text-gray-400 absolute left-3 top-4" />
                <input
                  name="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                  placeholder="Original Price"
                />
              </div>
            </div>

            {/* Category */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <FiGrid className="text-gray-400 absolute left-3 top-4" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-8 pr-8 py-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none appearance-none bg-white"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
                <div className="absolute right-3 top-4 pointer-events-none">
                  <FiChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              {errors.category && (
                <p className="mt-1 text-xs text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Brand */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <FiTag className="text-gray-400 absolute left-3 top-4" />
                <input
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                  placeholder="Brand"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <div className="relative">
                <div className="flex items-center gap-2">
                  <FiTag className="text-gray-400 absolute left-3 top-4" />
                  <input
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Tags (comma separated)"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["material", "careInstructions", "closure", "fit", "color"].map(
              (field) => (
                <div key={field} className="relative">
                  <input
                    name={`details.${field}`}
                    value={formData.details[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
                </div>
              )
            )}

            {/* Sizes */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Sizes & Stock
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="relative w-full">
                        <select
                          value={size.size}
                          onChange={(e) =>
                            handleSizeChange(index, "size", e.target.value)
                          }
                          className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiChevronDown className="text-gray-400" />
                        </div>
                      </div>
                      {formData.sizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSize(index)}
                          className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <FiMinus size={16} />
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        value={size.stock}
                        onChange={(e) =>
                          handleSizeChange(index, "stock", e.target.value)
                        }
                        className={`w-full px-3 py-2 border ${
                          errors[`size-${index}`]
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Stock"
                      />
                      {errors[`size-${index}`] && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors[`size-${index}`]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addSize}
                  className="flex flex-col items-center justify-center h-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                  <FiPlus size={20} />
                  <span className="mt-1 text-sm">Add Size</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === "media" && (
          <div className="space-y-6">
            {/* Main Image */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Main Image
              </h3>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="main-image-upload"
                  className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition-colors ${
                    errors.image
                      ? "border-red-500 text-red-500"
                      : "border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500"
                  }`}
                >
                  <FiImage size={20} />
                  <span>{formData.image ? formData.image.name : "Choose Main Image"}</span>
                </label>
                <input
                  id="main-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMainImageUpload}
                />
              </div>
              {errors.image && (
                <p className="mt-1 text-xs text-red-500">{errors.image}</p>
              )}
              {formData.image && (
                <div className="mt-4">
                  <div className="text-sm text-gray-500 mb-2">Preview:</div>
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-64 h-64 flex items-center justify-center overflow-hidden">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Main product"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Gallery Images
              </h3>
              <div className="flex flex-wrap gap-4">
                {formData.galleryImages.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 flex items-center justify-center overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)} // Correctly create URL for preview
                        alt={`Gallery ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FiX size={14} /> {/* Changed to FiX for a clearer icon */}
                    </button>
                  </div>
                ))}

                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-colors">
                  <FiPlus size={24} />
                  <span className="mt-2 text-sm">Add Image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                activeTab === "basic"
                  ? setActiveTab("media")
                  : setActiveTab(activeTab === "media" ? "details" : "basic")
              }
              className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
            >
              {activeTab === "basic"
                ? "Skip to Media"
                : activeTab === "media"
                ? "Back to Details"
                : "Back to Basic"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition shadow-md disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <FiSave size={18} />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;