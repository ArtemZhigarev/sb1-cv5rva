import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WooCommerceSettings: React.FC = () => {
  const [url, setUrl] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [chatwootApiKey, setChatwootApiKey] = useState('');
  const [chatwootAccountId, setChatwootAccountId] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedUrl = localStorage.getItem('woocommerce_url');
    const savedConsumerKey = localStorage.getItem('woocommerce_consumer_key');
    const savedConsumerSecret = localStorage.getItem('woocommerce_consumer_secret');
    const savedChatwootApiKey = localStorage.getItem('chatwoot_api_key');
    const savedChatwootAccountId = localStorage.getItem('chatwoot_account_id');

    if (savedUrl) setUrl(savedUrl);
    if (savedConsumerKey) setConsumerKey(savedConsumerKey);
    if (savedConsumerSecret) setConsumerSecret(savedConsumerSecret);
    if (savedChatwootApiKey) setChatwootApiKey(savedChatwootApiKey);
    if (savedChatwootAccountId) setChatwootAccountId(savedChatwootAccountId);
  }, []);

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('woocommerce_url', url);
    localStorage.setItem('woocommerce_consumer_key', consumerKey);
    localStorage.setItem('woocommerce_consumer_secret', consumerSecret);
    localStorage.setItem('chatwoot_api_key', chatwootApiKey);
    localStorage.setItem('chatwoot_account_id', chatwootAccountId);

    alert('Settings saved successfully!');
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Test WooCommerce connection
      const wooCommerceResponse = await axios.get(`${url}/wp-json/wc/v3/system_status`, {
        auth: {
          username: consumerKey,
          password: consumerSecret
        }
      });

      // Test Chatwoot connection
      const chatwootResponse = await axios.get(`https://app.chatwoot.com/api/v1/accounts/${chatwootAccountId}/dashboards`, {
        headers: {
          'api_access_token': chatwootApiKey
        }
      });

      if (wooCommerceResponse.status === 200 && chatwootResponse.status === 200) {
        setTestResult('Connection successful! Both WooCommerce and Chatwoot APIs are accessible.');
      } else {
        setTestResult('Connection failed. Please check your settings.');
      }
    } catch (error) {
      setTestResult('Connection failed. Please check your settings and ensure both APIs are enabled and accessible.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Integration Settings</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">WooCommerce URL</label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="consumerKey" className="block text-sm font-medium text-gray-700">WooCommerce Consumer Key</label>
            <input
              type="text"
              id="consumerKey"
              value={consumerKey}
              onChange={(e) => setConsumerKey(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="consumerSecret" className="block text-sm font-medium text-gray-700">WooCommerce Consumer Secret</label>
            <input
              type="password"
              id="consumerSecret"
              value={consumerSecret}
              onChange={(e) => setConsumerSecret(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="chatwootApiKey" className="block text-sm font-medium text-gray-700">Chatwoot API Key</label>
            <input
              type="text"
              id="chatwootApiKey"
              value={chatwootApiKey}
              onChange={(e) => setChatwootApiKey(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="chatwootAccountId" className="block text-sm font-medium text-gray-700">Chatwoot Account ID</label>
            <input
              type="text"
              id="chatwootAccountId"
              value={chatwootAccountId}
              onChange={(e) => setChatwootAccountId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Settings
            </button>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isLoading}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </form>
        {testResult && (
          <div className={`mt-4 p-3 rounded-md ${testResult.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default WooCommerceSettings;