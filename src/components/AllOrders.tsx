import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, ShoppingBag } from 'lucide-react';

interface Order {
  id: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  customer_id: number;
}

const AllOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const wooCommerceUrl = localStorage.getItem('woocommerce_url');
      const consumerKey = localStorage.getItem('woocommerce_consumer_key');
      const consumerSecret = localStorage.getItem('woocommerce_consumer_secret');

      if (!wooCommerceUrl || !consumerKey || !consumerSecret) {
        throw new Error('WooCommerce settings are not configured. Please set them in the WooCommerce Settings page.');
      }

      const response = await axios.get(`${wooCommerceUrl}/wp-json/wc/v3/orders`, {
        auth: {
          username: consumerKey,
          password: consumerSecret
        },
        params: {
          per_page: 20,
          page: page
        }
      });

      setOrders(prevOrders => {
        const newOrders = response.data.filter((newOrder: Order) => 
          !prevOrders.some(existingOrder => existingOrder.id === newOrder.id)
        );
        return [...prevOrders, ...newOrders];
      });
      setHasMore(response.data.length === 20);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">All Orders</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <div className="flex">
            <div className="py-1">
              <AlertCircle className="h-6 w-6 text-red-500 mr-4" />
            </div>
            <div>
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li key={`${order.id}-${page}`}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingBag className="h-6 w-6 text-gray-400 mr-3" />
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      Order #{order.number}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {order.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Customer ID: {order.customer_id}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Total: {order.total}</p>
                    <p className="ml-4">Date: {new Date(order.date_created).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default AllOrders;