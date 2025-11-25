import { useState, useEffect } from "react";

interface CryptoPrices {
  [key: string]: number;
}

const COINGECKO_IDS: { [key: string]: string } = {
  BNB: "binancecoin",
  USDT: "tether",
  BTC: "bitcoin",
  CAMLY: "camly", // If not available, will return undefined
};

export const useCryptoPrices = () => {
  const [prices, setPrices] = useState<CryptoPrices>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = Object.values(COINGECKO_IDS).filter(Boolean).join(",");
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );
        const data = await response.json();

        const newPrices: CryptoPrices = {};
        Object.entries(COINGECKO_IDS).forEach(([symbol, id]) => {
          if (data[id]?.usd) {
            newPrices[symbol] = data[id].usd;
          }
        });

        setPrices(newPrices);
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    
    // Refresh prices every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { prices, loading };
};
