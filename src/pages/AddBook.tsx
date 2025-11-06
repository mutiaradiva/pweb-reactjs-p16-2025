import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import ErrorBox from '../components/ErrorBox';

const AddBook: React.FC = () => {
  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [genreId, setGenreId] = useState<string>('');
  const [genres, setGenres] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch genres
    axios.get('/genre')
      .then(res => {
        const genresData = res.data.data || res.data || [];
        setGenres(Array.isArray(genresData) ? genresData : []);
      })
      .catch(err => {
        console.error('Failed to fetch genres:', err);
        setGenres([]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!title || !writer || !price || !stock) {
      return setError('All fields are required');
    }

    setLoading(true);
    try {
      const payload = {
        title,
        writer,
        price: Number(price),
        stock: Number(stock),
        genre_id: genreId || undefined,
      };
      
      console.log('Sending payload:', payload);
      const res = await axios.post('/books', payload);
      console.log('Response:', res.data);
      
      const bookId = res.data.id || res.data.data?.id;
      navigate(`/books/${bookId}`);
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
        {error && <ErrorBox message={error} />}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              placeholder="Enter book title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Writer *
            </label>
            <input
              type="text"
              placeholder="Enter author name"
              value={writer}
              onChange={e => setWriter(e.target.value)}
              className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price *
              </label>
              <input
                type="number"
                placeholder="0"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stock *
              </label>
              <input
                type="number"
                placeholder="0"
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Genre
            </label>
            <select
              value={genreId}
              onChange={e => setGenreId(e.target.value)}
              className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white focus:outline-none transition-colors"
            >
              <option value="">Select genre (optional)</option>
              {genres.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name || `Genre ${g.id}`}
                </option>
              ))}
            </select>
          </div>

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