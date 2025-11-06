import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import Loader from '../components/Loader';
import ErrorBox from '../components/ErrorBox';
import { Link } from 'react-router-dom';

type Transaction = {
  id: string;
  user_id: string;
  total_price: number;
  items?: any[];
  createdAt: string;
};

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/transactions');
        console.log('Transactions response:', res.data);
        
        const txData = res.data.data || res.data || [];
        setTransactions(Array.isArray(txData) ? txData : []);
      } catch (err: any) {
        console.error('Fetch transactions error:', err);
        setError(err?.response?.data?.message || 'Failed to load transactions');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Transactions</h1>
        <p className="text-gray-400">View your purchase history</p>
      </div>

      {error && <ErrorBox message={error} />}

      {transactions.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-600 text-2xl">🛒</span>
          </div>
          <p className="text-gray-500 mb-4">No transactions yet</p>
          <Link
            to="/books"
            className="inline-block px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transactions.map(tx => (
            <div
              key={tx.id}
              className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 rounded-lg p-6 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="text-white font-mono text-sm">{tx.id.slice(0, 8)}...</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-white text-sm">
                    {new Date(tx.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Amount</span>
                  <span className="text-xl font-bold text-cyan-400">
                    Rp {tx.total_price?.toLocaleString('id-ID')}
                  </span>
                </div>
                {tx.items && (
                  <div className="mt-2">
                    <span className="text-gray-500 text-sm">
                      {tx.items.length} item(s)
                    </span>
                  </div>
                )}
              </div>

              <Link
                to={`/transactions/${tx.id}`}
                className="block w-full px-4 py-2 text-center text-sm font-medium text-gray-300 hover:text-white border border-gray-800 hover:border-gray-700 rounded-lg transition-all"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transactions;