import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AddBook: React.FC = () => {
  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [publisher, setPublisher] = useState('');
  const [publicationYear, setPublicationYear] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [stockQuantity, setStockQuantity] = useState<number | ''>('');
  const [genreId, setGenreId] = useState<string>('');
  const [genre, setGenre] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Fetch genre saat komponen mount
  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const res = await axios.get('/genre'); // pastikan endpoint sesuai backend kamu
        const genreData = res.data.data || res.data || [];
        setGenre(Array.isArray(genreData) ? genreData : []);
      } catch (err) {
        console.error('Failed to fetch genre:', err);
        setGenre([]);
      }
    };

    fetchGenre();
  }, []);

  // 🔹 Handle tambah buku
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!title || !writer || !publisher || !publicationYear || !price || !stockQuantity) {
      return setError('All required fields must be filled');
    }

    setLoading(true);
    try {
      const payload = {
        title,
        writer,
        publisher,
        publication_year: Number(publicationYear),
        price: Number(price),
        stock_quantity: Number(stockQuantity),
        genre_id: genreId || undefined,
      };

      const res = await axios.post('/books', payload);
      const bookId = res.data.id || res.data.data?.id;

      setSuccessMessage('Book added successfully! 🎉 Redirecting...');
      setTimeout(() => navigate(`/books/${bookId}`), 1500);
    } catch (err: any) {
      console.error('Add book error:', err);
      setError(err?.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Add New Book</h1>
        <p className="text-gray-400">Fill in the details to add a book to the library</p>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              placeholder="Enter book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Author *
            </label>
            <input
              type="text"
              placeholder="Enter author name"
              value={writer}
              onChange={(e) => setWriter(e.target.value)}
              className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Publisher *
            </label>
            <input
              type="text"
              placeholder="Enter publisher name"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Publication Year *
              </label>
              <input
                type="number"
                placeholder="2024"
                min="1000"
                max="9999"
                value={publicationYear}
                onChange={(e) => setPublicationYear(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price *
              </label>
              <input
                type="number"
                placeholder="0"
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              placeholder="0"
              min="0"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
          </div>

          {/* 🔹 Dropdown Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Genre
            </label>
            <select
              value={genreId}
              onChange={(e) => setGenreId(e.target.value)}
              className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white focus:outline-none transition-colors mb-2"
            >
              <option value="">Select genre (optional)</option>
              {genre.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name || `Genre ${g.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Pesan sukses/gagal */}
          {error && (
            <p className="mt-3 text-sm text-red-400 border border-red-700/50 bg-red-900/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="mt-3 text-sm text-green-400 border border-green-700/50 bg-green-900/20 rounded-lg px-4 py-2">
              {successMessage}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Book'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/books')}
              className="px-6 py-2.5 text-gray-300 hover:text-white border border-gray-800 hover:border-gray-700 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
