import React, { useEffect, useMemo, useState } from "react";
import axios from "../api/axiosConfig";
import BookCard from "../components/BookCard";
import Loader from "../components/Loader";
import ErrorBox from "../components/ErrorBox";
import type { Book, Genre } from "../types";

const DEBOUNCE_MS = 300;

const BooksList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [genre, setGenre] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // debounced search term
  const [debounced, setDebounced] = useState(searchTerm);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchTerm), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const res = await axios.get("/genre");
        const genreData = res.data.data || res.data || [];
        setGenre(Array.isArray(genreData) ? genreData : []);
      } catch (err) {
        console.error("Failed to fetch genre:", err);
      }
    };
    fetchGenre();
  }, []);

  // Fetch books (supports genre filter + optional server-side search)
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      // Base endpoint. If your backend has a dedicated search route, change it here.
      let url = "/books";
      if (selectedGenre) url = `/books/genre/${selectedGenre}`;

      // Try common param keys for search; backend can ignore unknown params.
      const res = await axios.get(url, {
        params: {
          q: debounced || undefined,
          title: debounced || undefined,
          search: debounced || undefined,
        },
      });

      const booksData = res.data.data || res.data || [];
      setBooks(Array.isArray(booksData) ? booksData : []);
    } catch (err: any) {
      console.error("Fetch books error:", err);
      setError(err?.response?.data?.message || "Failed to load books");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // refetch when genre or debounced search term changes
  }, [selectedGenre, debounced]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/books/${id}`);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      setConfirmDeleteId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete");
    }
  };

  // Client-side fallback filter (case-insensitive title matching).
  // This runs even if server-side filtering is supported, but it’s cheap and safe.
  const displayedBooks = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    if (!term) return books;
    return books.filter((b) => b.title?.toLowerCase().includes(term));
  }, [books, debounced]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Books Collection</h1>
        <p className="text-gray-400">Browse and manage your book library</p>
      </div>

      {error && <ErrorBox message={error} />}

      {/* Controls: Search + Genre filter */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          {/* Search box */}
          <div className="flex-1">
            <label className="block text-gray-400 text-sm font-medium mb-1">
              Search by Title
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Pujo Dictionary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white focus:outline-none transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white border border-gray-800 hover:border-gray-700 rounded-lg transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Genre filter */}
          <div className="md:w-[340px]">
            <label className="block text-gray-400 text-sm font-medium mb-1">
              Filter by Genre
            </label>
            <div className="flex gap-2">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white focus:outline-none transition-colors"
              >
                <option value="">All Genres</option>
                {genre.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              {selectedGenre && (
                <button
                  onClick={() => setSelectedGenre("")}
                  className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white border border-gray-800 hover:border-gray-700 rounded-lg transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {displayedBooks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-600 text-2xl"></span>
          </div>
          <p className="text-gray-500 mb-2">No books found</p>
          <p className="text-gray-600 text-sm">
            {selectedGenre || debounced
              ? "Try adjusting your search or genre filter"
              : "Add some books to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedBooks.map((book) => (
            <div key={book.id} className="relative">
              <BookCard
                book={book}
                onDelete={() => setConfirmDeleteId(book.id)}
                genre={genre}
              />

              {/* Delete confirmation */}
              {confirmDeleteId === book.id && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg border border-gray-700 p-4">
                  <p className="text-gray-300 mb-4">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-white">
                      {book.title}
                    </span>
                    ?
                  </p>
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
