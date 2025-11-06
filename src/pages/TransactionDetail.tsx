import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axiosConfig';
import Loader from '../components/Loader';
import ErrorBox from '../components/ErrorBox';

type TransactionItem = {
  book_id: string;
  book_title?: string;
  title?: string;
  quantity: number;
  price: number;
};

type Transaction = {
  id: string;
  user_id: string;
  total_price: number;
  items: TransactionItem[];
  createdAt: string;
};

const TransactionDetail: React.FC = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/orders/${id}`); // Endpoint di Swagger: /orders/:id
        console.log('Transaction response:', res.data);
        
        const txData = res.data.data || res.data;
        setTransaction(txData);
      } catch (err: any) {
        console.error('Fetch transaction error:', err);
        setError(err?.response?.data?.message || 'Failed to load transaction details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTransaction();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} />;
  if (!transaction) return <div className="text-center py-16 text-gray-400">Transaction not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link
        to="/transactions"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <span>←</span> Back to Transactions
      </Link>

      <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Transaction Details</h1>

          {/* Transaction Info */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
              <p className="text-white font-mono">{transaction.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Date</p>
              <p className="text-white">
                {new Date(transaction.createdAt).toLocaleString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Items Purchased</h2>
            <div className="space-y-3">
              {transaction.items?.map((item, index) => (
                <div
                  key={index}
                  className="bg-black/50 border border-gray-800 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {item.book_title || item.title || `Book ID: ${item.book_id}`}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Quantity: {item.quantity} × Rp {item.price?.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-semibold">
                      Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold text-white">Total Amount</span>
              <span className="text-3xl font-bold text-cyan-400">
                Rp {transaction.total_price?.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;