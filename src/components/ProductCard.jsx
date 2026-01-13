import { Link } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const {
    _id,
    name,
    image,
    price,
    originalPrice,
    sizes = []
  } = product;

  // Dummy rating & reviews (you can replace later with backend values)
  const rating = 4; // 4 out of 5
  const numReviews = 27;

  // Calculate total stock from sizes
  const totalStock = sizes.reduce((acc, size) => acc + (size.stock || 0), 0);

  const renderStars = (ratingValue) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= ratingValue
          ? <FaStar key={i} className="text-yellow-400" />
          : <FaRegStar key={i} className="text-yellow-300" />
      );
    }
    return stars;
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg">
      {/* Product Image */}
      <Link to={`/product/${_id}`} className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Sale Badge */}
        {originalPrice && price < originalPrice && (
          <span className="absolute top-2 left-2 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow">
            Sale
          </span>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-col gap-2 p-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-medium text-gray-800 transition group-hover:text-indigo-600">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs">
          {renderStars(rating)}
          <span className="ml-1 text-gray-500">({numReviews} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-indigo-600">${price}</p>
          {originalPrice && price < originalPrice && (
            <p className="text-sm text-gray-400 line-through">${originalPrice}</p>
          )}
        </div>

        {/* Stock Status */}
        <p className={`text-xs font-medium ${totalStock < 5 ? 'text-red-500' : 'text-green-600'}`}>
          {totalStock < 1
            ? 'Out of Stock'
            : totalStock < 5
            ? `Only ${totalStock} left!`
            : 'In Stock'}
        </p>

        {/* Add to Cart Button */}
        <button onClick={()=>addToCart(product)}
          disabled={totalStock < 1}
          className={`mt-auto rounded-md px-4 py-2 text-sm font-medium transition ${
            totalStock < 1
              ? 'cursor-not-allowed bg-gray-300 text-gray-600'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {totalStock < 1 ? 'Unavailable' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
