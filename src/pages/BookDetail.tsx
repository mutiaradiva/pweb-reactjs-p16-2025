import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../api/axiosConfig";
import Loader from "../components/Loader";
import ErrorBox from "../components/ErrorBox";
import { useAuth } from "../context/AuthContext";
import type { Book, Genre } from "../types";

const BookDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch book & genre data
  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      setMessage(null);

      try {
        const res = await axios.get(`/books/${id}`);
        const bookData = res.data.data || res.data;
        setBook(bookData);

        if (bookData.genre_id) {
          const genreRes = await axios.get(`/genre/${bookData.genre_id}`);
          const genreData = genreRes.data.data || genreRes.data;
          setGenre(genreData);
        }
      } catch (err: any) {
        console.error("Fetch book error:", err);
        setError(err?.response?.data?.message || "Failed to load book details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBook();
  }, [id]);

  // Handle purchase
  const handleBuyNow = async () => {
    setMessage(null);

    if (!token) {
      setMessage({
        type: "error",
        text: "Please login first to make a purchase.",
      });
      navigate("/login");
      return;
    }

    if (!user?.id) {
      setMessage({
        type: "error",
        text: "User information not available. Please login again.",
      });
      navigate("/login");
      return;
    }

    if (quantity > (book?.stock_quantity || 0)) {
      setMessage({ type: "error", text: "Insufficient stock." });
      return;
    }

    try {
      const payload = {
        user_id: user.id,
        items: [{ book_id: id, quantity }],
      };

      const res = await axios.post("/transactions", payload);
      const transactionId = res.data.data?.id || res.data.id;

      setMessage({
        type: "success",
        text: "Purchase successful! Redirecting...",
      });

      // Redirect after short delay
      setTimeout(() => navigate(`/transactions/${transactionId}`), 1500);
    } catch (err: any) {
      console.error("Purchase error:", err);
      setMessage({
        type: "error",
        text:
          err?.response?.data?.message || "Purchase failed. Please try again.",
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`/books/${id}`);
      setMessage({
        type: "success",
        text: "Book deleted successfully! Redirecting...",
      });
      setTimeout(() => navigate("/books"), 1500);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to delete book.",
      });
    }
  };

  // Render states
  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} />;
  if (!book)
    return (
      <div className="text-center py-16 text-gray-400">Book not found</div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <Link
        to="/books"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <span>←</span> Back to Books
      </Link>

      {/* Main Card */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          {/* Feedback Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-center ${
                message.type === "success"
                  ? "bg-green-900/30 border border-green-700 text-green-300"
                  : "bg-red-900/30 border border-red-700 text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                {book.title}
              </h1>
              <p className="text-lg text-gray-400">by {book.writer}</p>

              {/* Meta row: genre + year + (optional) publisher */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                {genre?.name && (
                  <span className="inline-flex items-center rounded-md border border-gray-700 bg-black/40 px-2.5 py-1 text-gray-300">
                    Genre:
                    <span className="ml-1 font-medium text-white">
                      {genre.name}
                    </span>
                  </span>
                )}

                {typeof book.publication_year === "number" && (
                  <span className="inline-flex items-center rounded-md border border-gray-700 bg-black/40 px-2.5 py-1 text-gray-300">
                    Year:
                    <span className="ml-1 font-medium text-white">
                      {book.publication_year}
                    </span>
                  </span>
                )}

                {book.publisher && (
                  <span className="inline-flex items-center rounded-md border border-gray-700 bg-black/40 px-2.5 py-1 text-gray-300">
                    Publisher:
                    <span className="ml-1 font-medium text-white">
                      {book.publisher}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {token && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 border border-gray-700 hover:border-red-800 rounded-lg transition-all"
              >
                Delete Book
              </button>
            )}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="bg-black/40 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-1">Price</div>
              <div className="text-2xl font-bold text-cyan-400">
                Rp {book.price.toLocaleString("id-ID")}
              </div>
            </div>
            <div className="bg-black/40 border border-gray-800 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-1">Stock Available</div>
              <div
                className={`text-2xl font-bold ${
                  book.stock_quantity > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {book.stock_quantity} units
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-2">
              Description
            </h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {book.description?.trim()
                ? book.description
                : "No description available."}
            </p>
          </div>

          {/* Purchase Section */}
          {book.stock_quantity > 0 ? (
            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Purchase
              </h3>

              <div className="flex flex-col sm:flex-row items-end gap-4">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={book.stock_quantity}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(
                          1,
                          Math.min(book.stock_quantity, Number(e.target.value))
                        )
                      )
                    }
                    className="w-full px-4 py-2.5 bg-black border border-gray-800 focus:border-cyan-600 rounded-lg text-white focus:outline-none transition-colors"
                  />
                </div>

                <button
                  onClick={handleBuyNow}
                  className="w-full sm:w-auto px-8 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors"
                >
                  Buy Now
                </button>
              </div>

              <div className="mt-4 text-right">
                <span className="text-gray-400 text-sm">Total: </span>
                <span className="text-xl font-bold text-cyan-400">
                  Rp {(book.price * quantity).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          ) : (
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
