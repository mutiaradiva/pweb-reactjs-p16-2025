import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BooksList from "./pages/BooksList";
import BookDetail from "./pages/BookDetail";
import AddBook from "./pages/AddBook";
import Transactions from "./pages/Transactions";
import TransactionDetail from "./pages/TransactionDetail";
import ProtectedRoute from "./routes/ProtectedRoute";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 font-inter">
      <Navbar />
      <main className="p-6 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/books" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={<BooksList />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route
            path="/books/add"
            element={
              <ProtectedRoute>
                <AddBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/:id"
            element={
              <ProtectedRoute>
                <TransactionDetail />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
