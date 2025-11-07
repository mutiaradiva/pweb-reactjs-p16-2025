import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axiosConfig';
import Loader from '../components/Loader';
import ErrorBox from '../components/ErrorBox';

interface OrderItem {
  id: string;
  book_id: string;
  book_title?: string;
  quantity: number;
  price?: number; // nanti backend kirim harga per item
}

interface Transaction {
  id: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  order_items: OrderItem[];
  total_price?: number; // nanti backend kirim total transaksi
}

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
        const res = await axios.get(`/transactions/${id}`);
        console.log('Transaction response:', res.data);

        // Swagger terbaru punya responseObject
        const txData = res.data.data || res.data.responseObject?.[0] || res.data;
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
  if (!transaction)
    return (
      <div className="text-center py-16 text-gray-400">
        Transaction not found
      </div>
    );

  // Format tanggal
  const formattedDate = transaction.created_at
    ? new Date(transaction.created_at).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown Date';

  // Hitung total sementara jika backend belum kirim total_price
  const totalAmount =
    transaction.total_price ||
    transaction.order_items?.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 text-white">
      <Link
        to="/transactions"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to Transactions
      </Link>

      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">Transaction Details</h1>

          {/* Transaction Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-400 mb-1">Transaction ID</p>
              <p className="font-mono break-all">{transaction.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Date</p>
              <p>{formattedDate}</p>
            </div>
          </div>

          {/* Items Purchased */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Items Purchased</h2>
            <div className="space-y-3">
              {transaction.order_items?.length ? (
                transaction.order_items.map((item, index) => {
                  const price = item.price ?? 0;
                  const subtotal = price * item.quantity;

                  return (
                    <div
                      key={index}
                      className="bg-black/40 border border-gray-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.book_title || `Book ID: ${item.book_id}`}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Quantity: {item.quantity}
                          {price > 0 ? ` × Rp ${price.toLocaleString('id-ID')}` : ''}
                        </p>
                      </div>
                      {price > 0 && (
                        <div className="text-cyan-400 font-semibold mt-2 sm:mt-0">
                          Rp {subtotal.toLocaleString('id-ID')}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400">No items in this transaction.</p>
              )}
            </div>
          </div>

          {/* Total Amount */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold">Total Amount</span>
              <span className="text-3xl font-bold text-cyan-400">
                Rp {totalAmount?.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
