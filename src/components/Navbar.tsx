import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, token, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand Text Only */}
          <Link 
            to="/books" 
            className="group"
          >
            <span className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
              IT Literature Shop
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link 
              to="/books" 
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              Books
            </Link>
            
            {token && (
              <>
                <Link 
                  to="/transactions" 
                  className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Transactions
                </Link>
                <Link 
                  to="/books/add" 
                  className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Add Book
                </Link>
              </>
            )}

            {/* Auth Section */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-800">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
                  <span className="text-gray-500 text-sm">Loading...</span>
                </div>
              ) : token && user ? (
                <>
                  {/* User Info Dropdown/Display */}
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 border border-gray-800 rounded-lg">
                      <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        {user.name && (
                          <span className="text-white text-sm font-medium leading-tight">
                            {user.name}
                          </span>
                        )}
                        <span className="text-gray-400 text-xs leading-tight">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white border border-gray-800 hover:border-gray-700 rounded-md transition-all"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link 
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;