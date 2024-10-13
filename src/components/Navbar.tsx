import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User, Settings, Search, Package, ShoppingBag, Bug } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-xl font-semibold text-gray-800">
              <Home className="w-6 h-6 mr-2" />
              Chatwoot Dashboard
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/user-search" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <Search className="w-5 h-5 mr-1" />
              User Search
            </Link>
            <Link to="/all-products" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <Package className="w-5 h-5 mr-1" />
              All Products
            </Link>
            <Link to="/all-orders" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <ShoppingBag className="w-5 h-5 mr-1" />
              All Orders
            </Link>
            <Link to="/user-settings" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <User className="w-5 h-5 mr-1" />
              User Settings
            </Link>
            <Link to="/woocommerce-settings" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <Settings className="w-5 h-5 mr-1" />
              WooCommerce Settings
            </Link>
            <Link to="/chatwoot-debug" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <Bug className="w-5 h-5 mr-1" />
              Chatwoot Debug
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;