import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from 'lucide-react';
import axios from 'axios';
import StockSearch from './stockSearch';
import { motion } from 'framer-motion';
import { AlertCategoryEnum } from '@/redux/Alerts/types';

const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;

interface StockPriceData {
  price: number;
  changePercentage: number;
  change: number;
}

interface SourceSelectorProps {
  onSourceData: (data: any) => void;
}

const SourceSelector: React.FC<SourceSelectorProps> = ({ onSourceData }) => {
  const [selectedSource, setSelectedSource] = useState('');
  const [websiteUrls, setWebsiteUrls] = useState<string[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockDirection, setStockDirection] = useState('');
  const [stockValue, setStockValue] = useState('0');
  const [stockPrice, setStockPrice] = useState<StockPriceData | null>(null);
  const [stockPriceError, setStockPriceError] = useState<string | null>(null);
  const [isPrice, setIsPrice] = useState(true);
  const [linkedinCategories, setLinkedinCategories] = useState<string[]>([]);
  const [currentStockPrice, setCurrentStockPrice] = useState<number | null>(null);


  const linkedInOptions = [
    'Conference updates',
    'Product launch',
    'Partnership announced',
    'Customers announced',
    'Hires announced'
  ];

  const getRealTimePrice = async (symbol: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;
      const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`;
      
      const response = await axios.get(url);
      
      if (response.data && response.data.length > 0) {
        const data = response.data[0];
        return {
          price: data.price,
          changePercentage: data.changesPercentage,
          change: data.change
        };
      }
      throw new Error(`No data found for symbol ${symbol}`);
    } catch (error) {
      console.error('Error in getRealTimePrice:', error);
      throw error;
    }
  };

  // Update parent component whenever relevant data changes
  useEffect(() => {
    if (!selectedSource) return;

    let sourceData = {
      category: selectedSource as AlertCategoryEnum,
      data: {}
    };

    switch (selectedSource) {
      case AlertCategoryEnum.GENERIC_SEARCH:
        sourceData.data = {};
        break;

      case AlertCategoryEnum.SPECIFIC_URLS:
        sourceData.data = {
          urls: websiteUrls
        };
        break;

      case AlertCategoryEnum.LINKEDIN:
        sourceData.data = {
          linkedinUrl: linkedinUrl,
          linkedinMaxScrollAttempts: "10",
          linkedinNumberOfPosts: "5",
          linkedinMaxDays: "30",
          linkedinCategories: linkedinCategories
        };
        break;

      case AlertCategoryEnum.STOCK:
        sourceData.data = {
          stockSymbol: stockSymbol,
          stockPriceMovementType: isPrice ? 'price' : 'percentage',
          stockPriceMovementAmount: parseFloat(stockValue),
          stockMovementCondition: stockDirection === 'up' ? 'above' : 'below',
          stockTargetPrice: currentStockPrice
        };
        break;
    }

    onSourceData(sourceData);
  }, [selectedSource, websiteUrls, linkedinUrl, stockSymbol, stockDirection,
    stockValue, isPrice, linkedinCategories, currentStockPrice]);

  const handleAddWebsite = () => {
    if (websiteUrl && !websiteUrls.includes(websiteUrl)) {
      setWebsiteUrls([...websiteUrls, websiteUrl]);
      setWebsiteUrl('');
    }
  };

  const handleRemoveWebsite = (urlToRemove: string) => {
    setWebsiteUrls(websiteUrls.filter(url => url !== urlToRemove));
  };

  const handleStockSelect = async (stock: { symbol: string; name: string; exchangeShortName: string }) => {
    setStockSymbol(stock.symbol);
    try {
      const priceData = await getRealTimePrice(stock.symbol);
      setStockPrice(priceData);
      setStockPriceError(null);
    } catch (error) {
      setStockPriceError('Failed to fetch stock price');
      setStockPrice(null);
    }
  };

  const handleLinkedInCategoryToggle = (category: string) => {
    setLinkedinCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Add function to fetch current stock price
  const fetchStockPrice = async (symbol: string) => {
    const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`
      );
      if (response.data && response.data[0]) {
        setCurrentStockPrice(response.data[0].price);
      }
    } catch (error) {
      console.error('Error fetching stock price:', error);
    }
  };

  const sources = [
    'Generic Search',
    'Specific Set Of Websites',
    'Linkedin',
    'Stock Monitor'
  ];

  const renderStockContent = () => (
    <div className="mt-4 space-y-4">
      <div>
        <h2 className="text-md">Stock name</h2>
        <StockSearch onSelect={handleStockSelect} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-[#667085]">Current price</h4>
          {stockPrice && (
            <div className="space-y-1 bg-[#f7f9fe] p-2 rounded-md">
              <p className="text-2xl font-semibold text-[#001742]">
                {stockPrice.price.toFixed(2)}
              </p>
              <p className={`text-sm ${stockPrice.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stockPrice.change.toFixed(2)} ({stockPrice.changePercentage.toFixed(2)}%) today
              </p>
            </div>
          )}
        </div>

        {/* Stock Movement Column */}
        <div className="space-y-4">
          <h3 className="text-[#667085]">Stock movement</h3>
          
          <div className="flex rounded-lg bg-[#f7f9fe] p-1">
            <motion.div className="relative flex w-full">
              <div className="flex w-full">
                <button
                  className={`flex-1 py-2 text-center text-sm rounded-md relative z-10`}
                  onClick={() => setIsPrice(true)}
                >
                  Price
                </button>
                <button
                  className={`flex-1 py-2 text-center text-sm rounded-md relative z-10`}
                  onClick={() => setIsPrice(false)}
                >
                  Percentage
                </button>
              </div>
              <motion.div
                className="absolute inset-0 w-1/2 bg-white rounded-md shadow-sm"
                animate={{ x: isPrice ? 0 : '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.div>
          </div>

          <div className="flex rounded-lg border-2 border-[#eaf0fc] overflow-hidden">
            <Select 
              value={stockDirection} 
              onValueChange={setStockDirection}
            >
              <SelectTrigger className="flex-1 border-none shadow-none min-w-[140px]">
                <SelectValue placeholder="Moves up/down" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="up">Moves up</SelectItem>
                <SelectItem value="down">Moves down</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="number"
              value={stockValue}
              onChange={(e) => setStockValue(e.target.value)}
              className="w-24 p-2 border-l-2 border-[#eaf0fc] text-right"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedSource) {
      case AlertCategoryEnum.SPECIFIC_URLS:
        return (
          <div className="mt-4">
            <h2 className="text-sm mb-1">Add website urls</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="www.example.com"
                className="flex-1 p-2 border-2 border-[#eaf0fc] rounded text-sm"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
              <button
                className="bg-[#004CE6] text-white px-6 rounded"
                onClick={handleAddWebsite}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {websiteUrls.map((url, index) => (
                <div key={index} className="inline-flex items-center bg-[#f7f9fe] gap-2 justify-center border border-[#eaf0fc] rounded px-4 py-2">
                  <span className="text-[#4e5971]">{url}</span>
                  <button
                    className="text-[#4e5971]"
                    onClick={() => handleRemoveWebsite(url)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case AlertCategoryEnum.LINKEDIN:
        return (
          <div className="mt-4 space-y-4">
            <div>
              <h2 className="text-sm mb-1">Company LinkedIn URL</h2>
              <input
                type="text"
                placeholder="Company LinkedIn URL"
                className="w-full p-2 border-2 border-[#eaf0fc] text-sm rounded"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </div>

            <div>
              <h2 className="text-sm mb-2">Alert targets</h2>
              <div className="space-y-2">
                {linkedInOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={linkedinCategories.includes(option)}
                      onChange={() => handleLinkedInCategoryToggle(option)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case AlertCategoryEnum.STOCK:
        return renderStockContent();

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-md font-normal mb-1">Source</h1>

      <Select value={selectedSource} onValueChange={setSelectedSource}>
        <SelectTrigger className='shadow-none bg-[#ffffff] border-2 border-[#eaf0fc]'>
          <SelectValue placeholder="Select source" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(AlertCategoryEnum).map((source) => (
            <SelectItem key={source} value={source} className='cursor-pointer'>
              {source}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {renderContent()}
    </div>
  );
};

export default SourceSelector;