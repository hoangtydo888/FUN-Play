import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { 
  COINGECKO_IDS, 
  PANCAKESWAP_ROUTER, 
  CAMLY_TOKEN_ADDRESS, 
  CAMLY_DECIMALS,
  USDT_ADDRESS 
} from "@/config/tokens";

interface CryptoPrices {
  [key: string]: number;
}

const ROUTER_ABI = [
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)"
];

export const useCryptoPrices = () => {
  const [prices, setPrices] = useState<CryptoPrices>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Fetch CoinGecko prices
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

        // Fetch CAMLY price from PancakeSwap
        try {
          const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
          const router = new ethers.Contract(PANCAKESWAP_ROUTER, ROUTER_ABI, provider);
          
          const amountIn = ethers.parseUnits("1", CAMLY_DECIMALS); // 1 CAMLY
          const path = [CAMLY_TOKEN_ADDRESS, USDT_ADDRESS];
          
          const amounts = await router.getAmountsOut(amountIn, path);
          const usdtOut = ethers.formatUnits(amounts[1], 18); // USDT has 18 decimals
          newPrices["CAMLY"] = parseFloat(usdtOut);
        } catch (error) {
          console.error("Error fetching CAMLY price from PancakeSwap:", error);
          // Fallback price if PancakeSwap fails
          newPrices["CAMLY"] = 0.0001;
        }

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
