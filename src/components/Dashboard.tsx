import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, Search } from 'lucide-react';
import axios from 'axios';

interface ChatwootData {
  event?: string;
  data?: {
    contact?: {
      email?: string;
      name?: string;
    };
    currentAgent?: {
      email?: string;
      name?: string;
    };
  };
}

interface WooCommerceCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface WooCommerceOrder {
  id: number;
  number: string;
  status: string;
  total: string;
  date_created: string;
}

const Dashboard: React.FC = () => {
  const [chatwootData, setChatwootData] = useState<ChatwootData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState<WooCommerceCustomer | null>(null);
  const [orders, setOrders] = useState<WooCommerceOrder[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    window.addEventListener("message", handleChatwootMessage);
    return () => {
      window.removeEventListener("message", handleChatwootMessage);
    };
  }, []);

  useEffect(() => {
    if (chatwootData?.data?.contact?.email) {
      searchWooCommerceData(chatwootData.data.contact.email);
    }
  }, [chatwootData]);

  const handleChatwootMessage = (event: MessageEvent) => {
    try {
      let eventData: ChatwootData;
      if (typeof event.data === 'string') {
        eventData = JSON.parse(event.data);
      } else if (typeof event.data === 'object') {
        eventData = event.data;
      } else {
        throw new Error('Invalid data format');
      }
      
      setChatwootData(eventData);
      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.error("Error handling Chatwoot data:", err);
      setError("Failed to process Chatwoot data. Please try again.");
      setIsLoading(false);
    }
  };

  const fetchChatwootData = () => {
    setIsLoading(true);
    setError(null);
    try {
      window.parent.postMessage('chatwoot-dashboard-app:fetch-info', '*');
      setTimeout(() => {
        if (!chatwootData) {
          setError("No response received from Chatwoot. Please try again.");
          setIsLoading(false);
        }
      }, 5000); // 5-second timeout
    } catch (err) {
      console.error("Error requesting Chatwoot data:", err);
      setError("Failed to request Chatwoot data. Please try again.");
      setIsLoading(false);
    }
  };

  const searchWooCommerceData = async (email: string) => {
    setSearchError(null);
    try {
      const wooCommerceUrl = localStorage.getItem('woocommerce_url');
      const consumerKey = localStorage.getItem('woocommerce_consumer_key');
      const consumerSecret = localStorage.getItem('woocommerce_consumer_secret');

      if (!wooCommerceUrl || !consumerKey || !consumerSecret) {
        throw new Error('WooCommerce settings are not configured. Please set them in the WooCommerce Settings page.');
      }

      // Search for customer
      const customerResponse = await axios.get(`${wooCommerceUrl}/wp-json/wc/v3/customers`, {
        auth: {
          username: consumerKey,
          password: consumerSecret
        },
        params: { email }
      });

      if (customerResponse.data.length > 0) {
        setCustomer(customerResponse.data[0]);

        // Search for orders
        const ordersResponse = await axios.get(`${wooCommerceUrl}/wp-json/wc/v3/orders`, {
          auth: {
            username: consumerKey,
            password: consumerSecret
          },
          params: { customer: customerResponse.data[0].id }
        });

        setOrders(ordersResponse.data);
      } else {
        setCustomer(null);
        setOrders([]);
      }
    } catch (err) {
      console.error("Error searching WooCommerce data:", err);
      setSearchError("Failed to search WooCommerce data. Please check your settings and try again.");
    }
  };

  const renderChatwootData = () => {
    if (!chatwootData || !chatwootData.data) return <p>No Chatwoot data received yet.</p>;

    const contactEmail = chatwootData.data.contact?.email || 'Not available';
    const contactName = chatwootData.data.contact?.name || 'Not available';
    const agentEmail = chatwootData.data.currentAgent?.email || 'Not available';
    const agentName = chatwootData.data.currentAgent?.name || 'Not available';

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <p><strong>Email:</strong> {contactEmail}</p>
          <p><strong>Name:</strong> {contactName}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Current Agent</h3>
          <p><strong>Email:</strong> {agentEmail}</p>
          <p><strong>Name:</strong> {agentName}</p>
        </div>
      </div>
    );
  };

  const renderWooCommerceData = () => {
    if (searchError) {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-red-500 mr-4" />
            <div>
              <p className="font-bold">Error</p>
              <p>{searchError}</p>
            </div>
          </div>
        </div>
      );
    }

    if (!customer) {
      return <p>No WooCommerce customer found for this email.</p>;
    }

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">WooCommerce Customer</h3>
          <p><strong>ID:</strong> {customer.id}</p>
          <p><strong>Name:</strong> {customer.first_name} {customer.last_name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Orders</h3>
          {orders.length === 0 ? (
            <p>No orders found for this customer.</p>
          ) : (
            <ul className="space-y-2">
              {orders.map(order => (
                <li key={order.id} className="bg-gray-100 p-2 rounded">
                  <p><strong>Order #{order.number}</strong> - {order.status}</p>
                  <p>Total: {order.total}</p>
                  <p>Date: {new Date(order.date_created).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-red-500 mr-4" />
            <div>
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Chatwoot Data</h2>
        {renderChatwootData()}
        <button
          onClick={fetchChatwootData}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="animate-spin h-5 w-5 mr-2 inline-block" />
          ) : (
            <RefreshCw className="h-5 w-5 mr-2 inline-block" />
          )}
          Fetch Chatwoot Data
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">WooCommerce Data</h2>
        {renderWooCommerceData()}
      </div>
    </div>
  );
};

export default Dashboard;