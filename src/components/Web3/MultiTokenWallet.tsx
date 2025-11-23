import { useState, useEffect } from "react";
import { Wallet, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TokenBalance {
  symbol: string;
  balance: string;
  decimals: number;
}

const SUPPORTED_TOKENS = [
  { symbol: "BNB", address: "native", decimals: 18 },
  { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18 },
  { symbol: "CAMLY", address: "0x", decimals: 18 }, // Replace with actual CAMLY contract
  { symbol: "BTC", address: "0x", decimals: 18 }, // Replace with actual BTC contract (BTCB on BSC)
];

export const MultiTokenWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [selectedToken, setSelectedToken] = useState("BNB");
  const { toast } = useToast();

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to use Web3 features",
        variant: "destructive",
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      
      if (chainId !== "0x38") {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x38" }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x38",
                    chainName: "Binance Smart Chain",
                    nativeCurrency: {
                      name: "BNB",
                      symbol: "BNB",
                      decimals: 18,
                    },
                    rpcUrls: ["https://bsc-dataseed.binance.org/"],
                    blockExplorerUrls: ["https://bscscan.com/"],
                  },
                ],
              });
            } catch (addError) {
              toast({
                title: "Network Error",
                description: "Failed to add BSC network",
                variant: "destructive",
              });
              return;
            }
          } else {
            toast({
              title: "Network Error",
              description: "Please switch to BSC Mainnet",
              variant: "destructive",
            });
            return;
          }
        }
      }

      setAddress(accounts[0]);
      setIsConnected(true);
      
      // Fetch balances for all supported tokens
      await fetchBalances(accounts[0]);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const fetchBalances = async (userAddress: string) => {
    const newBalances: TokenBalance[] = [];

    for (const token of SUPPORTED_TOKENS) {
      try {
        if (token.address === "native") {
          // Fetch BNB balance
          const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [userAddress, "latest"],
          });
          const bnbBalance = (parseInt(balance, 16) / 1e18).toFixed(4);
          newBalances.push({ symbol: token.symbol, balance: bnbBalance, decimals: token.decimals });
        } else {
          // Fetch ERC-20 token balance
          // This would require ethers.js or web3.js for proper implementation
          newBalances.push({ symbol: token.symbol, balance: "0.0000", decimals: token.decimals });
        }
      } catch (error) {
        console.error(`Error fetching ${token.symbol} balance:`, error);
        newBalances.push({ symbol: token.symbol, balance: "0.0000", decimals: token.decimals });
      }
    }

    setBalances(newBalances);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress("");
    setBalances([]);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const currentBalance = balances.find(b => b.symbol === selectedToken)?.balance || "0.0000";

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden md:inline">
                {currentBalance} {selectedToken}
              </span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {address.slice(0, 6)}...{address.slice(-4)}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Token Balances
            </DropdownMenuLabel>
            {balances.map((token) => (
              <DropdownMenuItem
                key={token.symbol}
                onClick={() => setSelectedToken(token.symbol)}
                className={selectedToken === token.symbol ? "bg-accent" : ""}
              >
                <span className="font-medium">{token.symbol}</span>
                <span className="ml-auto text-muted-foreground">{token.balance}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={disconnectWallet} className="text-destructive">
              Disconnect Wallet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      size="sm"
      className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <Wallet className="h-4 w-4" />
      <span className="hidden md:inline">Connect Wallet</span>
    </Button>
  );
};

declare global {
  interface Window {
    ethereum?: any;
  }
}
