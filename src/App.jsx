import { useEffect, useState } from 'react';
import StockChart from './StockChart';
import './App.css';

const stockOptions = [
  { label: 'Tesla (TSLA)', value: 'TSLA' },
  { label: 'Apple (AAPL)', value: 'AAPL' },
  { label: 'Google (GOOGL)', value: 'GOOGL' },
  { label: 'Amazon (AMZN)', value: 'AMZN' },
  { label: 'Infosys (INFY.NS)', value: 'INFY.NS' },
  { label: 'TCS (TCS.NS)', value: 'TCS.NS' },
  { label: 'Reliance (RELIANCE.NS)', value: 'RELIANCE.NS' },
  { label: 'Microsoft (MSFT)', value: 'MSFT' },
  { label: 'Wipro (WIPRO.NS)', value: 'WIPRO.NS' },
];

const currencyOptions = [
  { label: 'USD ($)', value: 'USD', rate: 1 },
  { label: 'INR (₹)', value: 'INR', rate: 83.2 },
];

const API_URL = 'https://stockback-9n25.onrender.com';

function App() {
  const [symbol, setSymbol] = useState('TSLA');
  const [priceUSD, setPriceUSD] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [history, setHistory] = useState({ dates: [], prices: [] });

  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/stock/${symbol}`);
      const data = await res.json();
      setPriceUSD(parseFloat(data.price));
    } catch (err) {
      setPriceUSD(null);
    }
    setLoading(false);
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/api/stock/${symbol}/history`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      setHistory({ dates: [], prices: [] });
    }
  };

  useEffect(() => {
    fetchStock();
    fetchHistory();
  }, [symbol]);

  const currentCurrency = currencyOptions.find((c) => c.value === currency);
  const convertedPrice = priceUSD ? (priceUSD * currentCurrency.rate).toFixed(2) : null;

  return (
    <div className="App">
      <h1>Live Stock Viewer</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          <strong>Stock:</strong>{' '}
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            {stockOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          <strong>Currency:</strong>{' '}
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {currencyOptions.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </label>
      </div>

      <button
        onClick={fetchStock}
        disabled={loading}
        style={{
          padding: '0.5rem 1rem',
          background: loading ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Loading...' : 'Refresh Price'}
      </button>

      {convertedPrice && (
        <p style={{ marginTop: '1rem' }}>
          Current Price of <strong>{symbol}</strong>: {currentCurrency.label.split(' ')[1]}
          {convertedPrice}
        </p>
      )}

      {history.dates.length > 0 && (
        <div className="StockChart">
          <StockChart dates={history.dates} prices={history.prices} symbol={symbol} />
        </div>
      )}
    </div>
  );
}

export default App;
