import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { FiHeart } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`/api/products`, { params: { id } });
        const found = res.data.products?.find(p => String(p.id) === String(id));
        setProduct(found || null);
      } catch (err) {
        setError('Gagal memuat produk');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && (sizeOptions.length === 0 || selectedSize)) {
      addToCart({...product, selectedSize}, 1);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error || !product) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Product not found.'}</div>;

  const wishlisted = isInWishlist(product.id);

  // Mapping nama produk ke banner
  const productBannerMap = {
    'Celana Jeans Slim Fit': '/slimfit_banner.webp',
    'Sepatu Sneakers': '/sneakers_banner.jpg',
    'Tas Ransel': '/ransel_banner.jpg',
    'Jam Tangan Classic': '/jam_banner.jpg',
  };
  // Mapping nama produk ke pilihan size
  const productSizeMap = {
    'Celana Jeans Slim Fit': ['1', '2', '3'],
    'Sepatu Sneakers': Array.from({length: 45-31+1}, (_,i) => String(31+i)),
    'Tas Ransel': ['1', '2', '3'],
    'Jam Tangan Classic': ['All Size'],
  };
  const sizeOptions = productSizeMap[product.name] || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Gambar */}
          <div className="md:w-1/2 flex items-center justify-center relative">
            {/* Wishlist Icon */}
            <button
              className={`absolute top-3 right-3 z-10 text-2xl ${wishlisted ? 'text-pink-600' : 'text-gray-400 hover:text-pink-500'}`}
              onClick={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart fill={wishlisted ? '#ec4899' : 'none'} />
            </button>
            <img
              src={productBannerMap[product.name] ? productBannerMap[product.name] : (product.images && product.images.length > 0 ? product.images[0] : '/no-image.png')}
              alt={product.name}
              className="w-full max-w-md h-96 object-cover rounded shadow"
              onError={e => { e.target.src = '/no-image.png'; }}
            />
          </div>
          {/* Info Produk */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="text-purple-600 font-bold text-2xl mb-2">Rp{Number(product.price).toLocaleString()}</div>
            <div className="text-sm text-gray-500 mb-2">Kategori: {product.categoryName || '-'}</div>
            <div className="text-sm text-gray-500 mb-2">Stok: {product.stock ?? '-'}</div>
            {/* Pilihan Size */}
            {sizeOptions.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Size</label>
                <select
                  className="border rounded px-4 py-2 w-full md:w-1/2"
                  value={selectedSize}
                  onChange={e => setSelectedSize(e.target.value)}
                >
                  <option value="">-- Pilih Size --</option>
                  {sizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="text-gray-700 mb-6">{product.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur.'}</div>
            <button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all w-full md:w-auto disabled:opacity-50"
              onClick={handleAddToCart}
              disabled={sizeOptions.length > 0 && !selectedSize}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 