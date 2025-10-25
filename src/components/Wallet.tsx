import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet as WalletIcon, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


declare global {
  interface Window {
    ethereum?: any;
  }
}

const SEPOLIA_CHAIN_ID = "0xaa36a7"; // Sepolia testnet chain ID

const Wallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    const isInstalled = typeof window !== "undefined" && window.ethereum && window.ethereum.isMetaMask;
    console.log('MetaMask installed:', isInstalled);
    return isInstalled;
  };

  // Switch to Sepolia testnet
  const switchToSepolia = async () => {
    console.log('Switching to Sepolia...');

    try {
      // First check if we're already on Sepolia
      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      console.log('Current chain ID:', currentChainId);

      if (currentChainId === SEPOLIA_CHAIN_ID) {
        console.log("Already on Sepolia network");
        return;
      }

      console.log("Switching to Sepolia network...");
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      console.log("Successfully switched to Sepolia");
    } catch (switchError: any) {
      console.log("Switch error:", switchError);
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        console.log("Adding Sepolia network...");
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: "Sepolia Testnet",
                nativeCurrency: {
                  name: "SepoliaETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.sepolia.org", "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
                blockExplorerUrls: ["https://sepolia.etherscan.io/"],
              },
            ],
          });
          console.log("Successfully added Sepolia network");
        } catch (addError) {
          console.error("Error adding Sepolia network:", addError);
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    console.log('=== CONNECT WALLET STARTED ===');

    if (!isMetaMaskInstalled()) {
      console.log('MetaMask not detected');
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    console.log('MetaMask detected, proceeding with connection');
    setIsLoading(true);

    try {
      // First check if already connected
      console.log('Checking if already connected...');
      console.log(window.ethereum);
      console.log('window.ethereum available:', !!window.ethereum);
      console.log('window.ethereum.isMetaMask:', window.ethereum?.isMetaMask);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log('eth_accounts response:', accounts);
      console.log('Accounts length:', accounts?.length);

      // Force a small delay to ensure MetaMask processes
      await new Promise(resolve => setTimeout(resolve, 100));

      if (accounts && accounts.length > 0) {
        console.log('Already connected, using existing account');
        const account = accounts[0];

        // Check current network
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        console.log('Current chain ID:', chainId);

        if (chainId !== SEPOLIA_CHAIN_ID) {
          console.log('Not on Sepolia, switching...');
          await switchToSepolia();
        } else {
          console.log('Already on Sepolia');
        }

        console.log('Creating ethers provider...');
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log('Getting signer...');
        const signer = await provider.getSigner();
        console.log('Getting address...');
        const address = await signer.getAddress();
        console.log('Getting balance...');
        const balanceWei = await provider.getBalance(address);
        const balanceEth = ethers.formatEther(balanceWei);

        console.log('Setting state...');
        setAccount(address);
        setBalance(balanceEth);
        setIsConnected(true);

        toast({
          title: "Wallet connected",
          description: `Connected to Sepolia testnet with account ${address.slice(0, 6)}...${address.slice(-4)}`,
        });

        console.log('Connection successful!');
        return;
      }

      // Not connected, request access
      console.log('Not connected, requesting account access...');
      console.log('About to call eth_requestAccounts...');

      // Force a small delay before requesting
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('Calling eth_requestAccounts now...');
      const newAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log('eth_requestAccounts response:', newAccounts);
      console.log('New accounts length:', newAccounts?.length);

      if (!newAccounts || newAccounts.length === 0) {
        throw new Error("No accounts found");
      }

      const account = newAccounts[0];
      console.log('Using account:', account);

      // Switch to Sepolia
      await switchToSepolia();

      console.log('Creating ethers provider...');
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log('Getting signer...');
      const signer = await provider.getSigner();
      console.log('Getting address...');
      const address = await signer.getAddress();
      console.log('Getting balance...');
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);

      console.log('Setting state...');
      setAccount(address);
      setBalance(balanceEth);
      setIsConnected(true);

      toast({
        title: "Wallet connected",
        description: `Connected to Sepolia testnet with account ${address.slice(0, 6)}...${address.slice(-4)}`,
      });

      console.log('Connection successful!');
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      let errorMessage = "Failed to connect wallet. Please try again.";
      if (error.code === 4001) {
        errorMessage = "Connection request was rejected by user.";
      } else if (error.code === 4902) {
        errorMessage = "Sepolia network not available. Please add it manually.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Connection failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setIsConnected(false);
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  if (!isMetaMaskInstalled()) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div>
            <p className="font-medium">MetaMask Required</p>
            <p className="text-sm text-muted-foreground">
              Install MetaMask to connect your wallet
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <WalletIcon className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Testnet Wallet</p>
            <p className="text-sm text-muted-foreground">SepoliaETH Network</p>
          </div>
        </div>

        {isConnected ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Badge variant="secondary">Disconnected</Badge>
        )}
      </div>

      {isConnected && account && (
        <div className="mt-4 space-y-2">
          <div>
            <p className="text-sm font-medium">Account</p>
            <p className="text-sm text-muted-foreground font-mono">
              {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Balance</p>
            <p className="text-sm text-muted-foreground">
              {balance ? `${parseFloat(balance).toFixed(4)} ETH` : "Loading..."}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4">
        {!isConnected ? (
          <Button onClick={connectWallet} disabled={isLoading} className="w-full">
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </Button>
        ) : (
          <Button onClick={disconnectWallet} variant="outline" className="w-full">
            Disconnect
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Wallet;
