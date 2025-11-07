import React from 'react';
import { Link } from 'react-router-dom';

type BookCardProps = {
  book: {
    id: string;
    title: string;
    writer: string;
    price: number;
    stock_quantity: number;
    genre_id?: string;
    publish_date?: string;
  };
  onDelete: (id: string) => void;
  genre?: Array<{ id: string; name: string }>;
};

const BookCard: React.FC<BookCardProps> = ({ book, onDelete, genre }) => {
  const getGenreName = (genreId?: string) => {
    if (!genreId || !genre) return null;
    const genre = genre.find(g => g.id === genreId);
    return genre?.name;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="group bg-gray-900/50 border border-gray-800 hover:border-gray-700 rounded-lg p-5 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link 
            to={`/books/${book.id}`}
            className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 block"
          >
            {book.title}
          </Link>
          <p className="text-sm text-gray-400 mt-1">by {book.writer}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {book.genre_id && getGenreName(book.genre_id) && (
            <div className="inline-block px-2 py-1 bg-cyan-900/30 border border-cyan-800/50 text-cyan-300 text-xs rounded">
              {getGenreName(book.genre_id)}
            </div>
          )}
          {book.publish_date && (
            <div className="inline-block px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">
              📅 {formatDate(book.publish_date)}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm pt-2">
          <span className="text-gray-500">Price</span>
          <span className="text-cyan-400 font-semibold">
            Rp {book.price?.toLocaleString('id-ID')}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Stock</span>
          <span className={`font-medium ${book.stock_quantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {book.stock_quantity} units
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-800">
        <Link
          to={`/books/${book.id}`}
          className="flex-1 px-3 py-2 text-center text-sm font-medium text-gray-300 hover:text-white border border-gray-800 hover:border-gray-700 rounded-md transition-all"
        >
          View Details
        </Link>
        <button
          onClick={() => onDelete(book.id)}
          className="px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 border border-gray-800 hover:border-red-900 rounded-md transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BookCard;