import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';
import ErrorBox from '../components/ErrorBox';
import type { Book, Genre } from '../types';

const BooksList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [genre, setGenre] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const res = await axios.get('/genre');
        const genreData = res.data.data || res.data || [];
        setGenre(Array.isArray(genreData) ? genreData : []);
      } catch (err) {
        console.error('Failed to fetch genre:', err);
      }
    };
    fetchGenre();
  }, []);

  // Fetch books
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/books';
      
      if (selectedGenre) {
        url = `/books/genre_id?genre_id=${selectedGenre}`;
      }
      
      const res = await axios.get(url);
      console.log('Books response:', res.data);
      
      const booksData = res.data.data || res.data || [];
      setBooks(Array.isArray(booksData) ? booksData : []);
    } catch (err: any) {
      console.error('Fetch books error:', err);
      setError(err?.response?.data?.message || 'Failed to load books');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [selectedGenre]);

const handleDelete = async (id: string) => {
  try {
    await axios.delete(`/books/${id}`);
    setBooks(prev => prev.filter(b => b.id !== id));
    setConfirmDeleteId(null);
  } catch (err: any) {
    alert(err?.response?.data?.message || 'Failed to delete');
  }
};

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Books Collection</h1>
        <p className="text-gray-400">Browse and manage your book library</p>
      </div>

      {error && <ErrorBox message={error} />}

      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-6">
        <div className="flex gap-3 items-center">
          <label className="text-gray-400 text-sm font-medium">Filter by Genre:</label>
          <select
            value={selectedGenre}
            onChange={e => setSelectedGenre(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white focus:outline-none transition-colors"
          >
            <option value="">All Genres</option>
            {genre.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          
          {selectedGenre && (
            <button
              onClick={() => setSelectedGenre('')}
              className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white border border-gray-800 hover:border-gray-700 rounded-lg transition-all"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-600 text-2xl">📚</span>
          </div>
          <p className="text-gray-500 mb-2">No books found</p>
          <p className="text-gray-600 text-sm">
            {selectedGenre ? 'Try selecting a different genre' : 'Add some books to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map(book => (
  <div key={book.id} className="relative">
    <BookCard book={book} onDelete={() => setConfirmDeleteId(book.id)} genre={genre} />

    {/* Konfirmasi hapus */}
    {confirmDeleteId === book.id && (
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg border border-gray-700 p-4">
        <p className="text-gray-300 mb-4">Are you sure you want to delete <span className="font-semibold text-white">{book.title}</span>?</p>
        <div className="flex gap-3">
          <button
            onClick={() => handleDelete(book.id)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
          >
            Yes
          </button>
          <button
            onClick={() => setConfirmDeleteId(null)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>
))}

        </div>
      )}
    </div>
  );
};

export default BooksList;