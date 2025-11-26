import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { bsc } from '@wagmi/core/chains';

// WalletConnect Project ID (public - safe to expose)
const projectId = '8c5a8b7f9d6e4c3b2a1f0e9d8c7b6a5f';

const metadata = {
  name: 'FUN PLAY',
  description: 'FUN PLAY - Video Platform với Web3',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://camlyplatform.org',
  icons: ['/images/camly-coin.png']
};

// Wagmi config
export const wagmiConfig = defaultWagmiConfig({
  chains: [bsc],
  projectId,
  metadata,
});

// Create Web3Modal instance
let modal: ReturnType<typeof createWeb3Modal> | null = null;

export const getWeb3Modal = () => {
  if (!modal && typeof window !== 'undefined') {
    modal = createWeb3Modal({
      wagmiConfig,
      projectId,
      themeMode: 'dark',
      themeVariables: {
        '--w3m-accent': '#FFD700',
        '--w3m-border-radius-master': '8px',
      },
      featuredWalletIds: [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
        'efe5cb9b5d89c58c5b7d3d9e75eba0f1c564e8e8a2f5c5b8a0e8f9b0c1d2e3f4', // Bitget Wallet
      ],
      enableAnalytics: false,
    });
  }
  return modal;
};
