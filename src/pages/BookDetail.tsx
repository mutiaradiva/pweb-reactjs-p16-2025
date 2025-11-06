import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axiosConfig';
import Loader from '../components/Loader';
import ErrorBox from '../components/ErrorBox';
import { useAuth } from '../context/AuthContext';

type Book = {
  id: string;
  title: string;
  writer: string;
  price: number;
  stock: number;
  genre_id?: string;
  publish_date?: string;
};

type Genre = {
  id: string;
  name: string;
};

const BookDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch book details
        const bookRes = await axios.get(`/books/${id}`);
        const bookData = bookRes.data.data || bookRes.data;
        setBook(bookData);

        // Fetch genre if genre_id exists
        if (bookData.genre_id) {
          try {
            const genreRes = await axios.get(`/genre/${bookData.genre_id}`);
            const genreData = genreRes.data.data || genreRes.data;
            setGenre(genreData);
          } catch (err) {
            console.error('Failed to fetch genre:', err);
          }
        }
      } catch (err: any) {
        console.error('Fetch book error:', err);
        setError(err?.response?.data?.message || 'Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBook();
  }, [id]);

  const handleBuyNow = async () => {
    if (!token) {
      alert('Please login first to make a purchase');
      navigate('/login');
      return;
    }

    if (quantity > (book?.stock || 0)) {
      alert('Insufficient stock');
      return;
    }

    if (!confirm(`Buy ${quantity} item(s) of "${book?.title}"?`)) return;

    try {
      const payload = {
        items: [
          {
            book_id: id,
            quantity: quantity,
          },
        ],
      };

      const res = await axios.post('/transactions', payload);
      const transactionId = res.data.data?.id || res.data.id;
      
      alert('Purchase successful!');
      navigate(`/transactions/${transactionId}`);
    } catch (err: any) {
      console.error('Purchase error:', err);
      alert(err?.response?.data?.message || 'Purchase failed');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      await axios.delete(`/books/${id}`);
      alert('Book deleted successfully');
      navigate('/books');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete book');
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} />;
  if (!book) return <div className="text-center py-16 text-gray-400">Book not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back Button */}
      <Link
        to="/books"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <span>←</span> Back to Books
      </Link>

      <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{book.title}</h1>
              <p className="text-xl text-gray-400">by {book.writer}</p>
            </div>
            
            {token && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 border border-gray-800 hover:border-red-900 rounded-lg transition-all"
              >
                Delete Book
              </button>
            )}
          </div>

          {/* Genre & Date */}
          <div className="flex items-center gap-3 mb-6">
            {genre && (
              <div className="px-3 py-1.5 bg-cyan-900/30 border border-cyan-800/50 text-cyan-300 text-sm rounded-lg">
                {genre.name}
              </div>
            )}
            {book.publish_date && (
              <div className="px-3 py-1.5 bg-gray-800 text-gray-300 text-sm rounded-lg">
                Published: {new Date(book.publish_date).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            )}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-black/50 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Price</div>
              <div className="text-2xl font-bold text-cyan-400">
                Rp {book.price.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="bg-black/50 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Stock Available</div>
              <div className={`text-2xl font-bold ${book.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {book.stock} units
              </div>
            </div>
          </div>

          {/* Purchase Section */}
          {book.stock > 0 && (
            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Purchase</h3>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={book.stock}
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, Math.min(book.stock, Number(e.target.value))))}
                    className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white focus:outline-none transition-colors"
                  />
                </div>
                <button
                  onClick={handleBuyNow}
                  className="px-8 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors"
                >
                  Buy Now
                </button>
              </div>
              <div className="mt-4 text-right">
                <span className="text-gray-400 text-sm">Total: </span>
                <span className="text-xl font-bold text-cyan-400">
                  Rp {(book.price * quantity).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}

          {book.stock === 0 && (
            <div className="border border-red-800 bg-red-900/20 rounded-lg p-4 text-center">
              <p className="text-red-400 font-medium">Out of Stock</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;