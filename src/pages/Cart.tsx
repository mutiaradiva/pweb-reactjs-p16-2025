import React, { useState, useEffect } from "react";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

type CartItem = {
  id: string;
  title: string;
  price: number;
  stock_quantity: number;
  quantity: number;
};

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const updateCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const handleQuantityChange = (id: string, qty: number) => {
    updateCart(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

  const handleRemove = (id: string) => {
    updateCart(cartItems.filter((item) => item.id !== id));
  };

  const handleCheckout = async () => {
    setConfirm(false);
    setLoading(true);
    setMessage(null);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      setMessage("You must be logged in to checkout.");
      setLoading(false);
      return navigate("/login");
    }

    try {
      const payload = {
        user_id: userId,
        items: cartItems.map((item) => ({
          book_id: item.id,
          quantity: item.quantity,
        })),
      };

      const res = await axios.post("/orders", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Purchase successful!");
      localStorage.removeItem("cart");
      setCartItems([]);
    } catch (err: any) {
      console.error(err);
      setMessage(
        err?.response?.data?.message || "Failed to complete purchase."
      );
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0)
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg mb-3">🛒 Your cart is empty.</p>
        <button
          onClick={() => navigate("/books")}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium"
        >
          Browse Books
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900/60 rounded-lg border border-gray-800">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      {message && (
        <div
          className={`p-3 mb-4 rounded ${
            message.includes("✅")
              ? "bg-green-800/40 text-green-300 border border-green-700"
              : "bg-red-800/40 text-red-300 border border-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <table className="w-full text-sm text-gray-300 mb-6">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th className="text-left py-2">Title</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id} className="border-b border-gray-800">
              <td className="py-2">{item.title}</td>
              <td className="text-right">Rp {item.price.toLocaleString("id-ID")}</td>
              <td className="text-center">
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  max={item.stock_quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, Number(e.target.value))
                  }
                  className="w-16 text-center bg-gray-800 border border-gray-700 rounded"
                />
              </td>
              <td className="text-right">
                Rp {(item.price * item.quantity).toLocaleString("id-ID")}
              </td>
              <td className="text-right">
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Total: Rp {total.toLocaleString("id-ID")}</h2>
        {!confirm ? (
          <button
            onClick={() => setConfirm(true)}
            disabled={loading}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium"
          >
            {loading ? "Processing..." : "Buy Now"}
          </button>
        ) : (
          <div className="flex gap-3">
            <p>Confirm purchase?</p>
            <button
              onClick={handleCheckout}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirm(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
