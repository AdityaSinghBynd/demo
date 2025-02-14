import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

interface StockSearchProps {
  onSelect: (stock: {
    symbol: string;
    name: string;
    exchangeShortName: string;
  }) => void;
}

interface StockResult {
  symbol: string;
  name: string;
  exchangeShortName: string;
}

const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;

const StockSearch: React.FC<StockSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchStocks = async (searchQuery: string) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/search?query=${searchQuery}&limit=10&apikey=${apiKey}`
      );
      setResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching stocks:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Add debounced search function
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      searchStocks(searchQuery);
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 2) {
      debouncedSearch(value);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelect = (stock: StockResult) => {
    onSelect(stock);
    setQuery(`${stock.name} (${stock.symbol})`);
    setShowResults(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for stocks by name or symbol..."
          className="w-full p-2 border rounded text-sm border-[#eaf0fc]"
        />
        {loading && (
          <div className="absolute right-2 top-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          </div>
        )}
      </div>
      
      {showResults && results.length > 0 && (
        <div className="absolute z-50 p-2 w-full mt-1 bg-white border border-[#eaf0fc] rounded-md shadow-custom-blue gap-2 max-h-60 overflow-auto">
          {results.map((stock) => (
            <div
              key={stock.symbol}
              className="p-2 hover:bg-[#f7f9fe] cursor-pointer rounded-md"
              onClick={() => handleSelect(stock)}
            >
              <div className="font-medium">{stock.name}</div>
              <div className="text-sm text-gray-500">
                {stock.symbol} • {stock.exchangeShortName}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockSearch;