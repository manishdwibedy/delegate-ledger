import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, RefreshCw, DollarSign, ExternalLink } from "lucide-react";
import { tradeLoggerContract, PnLResult, getContractEtherscanUrl } from "@/lib/contract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const PnLDisplay = () => {
  const [pnlHistory, setPnlHistory] = useState<PnLResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPnL, setTotalPnL] = useState<bigint>(BigInt(0));
  const { toast } = useToast();

  const fetchPnLHistory = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet not connected",
        description: "Connect your wallet to view P/L history from the blockchain.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Initialize contract
      tradeLoggerContract.initialize(provider, signer);

      // Fetch P/L history
      const history = await tradeLoggerContract.getPnLHistory();
      setPnlHistory(history);

      // Calculate total P/L
      const total = history.reduce((sum, pnl) => sum + pnl.netProfitOrLoss, BigInt(0));
      setTotalPnL(total);

      toast({
        title: "P/L history updated",
        description: `Loaded ${history.length} P/L records from blockchain.`,
      });
    } catch (error: any) {
      console.error("Failed to fetch P/L history:", error);
      toast({
        title: "Failed to load P/L history",
        description: error.message || "Could not fetch data from smart contract.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-fetch on component mount if wallet is available
    if (window.ethereum) {
      fetchPnLHistory();
    }
  }, []);

  const formatCurrency = (value: bigint) => {
    // Convert from wei to ETH (assuming 18 decimals)
    const ethValue = Number(ethers.formatEther(value));
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(ethValue);
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getPnLColor = (pnl: bigint) => {
    return pnl >= 0 ? "text-green-600" : "text-red-600";
  };

  const getPnLBadgeVariant = (pnl: bigint) => {
    return pnl >= 0 ? "default" : "destructive";
  };

  return (
    <Card className="p-6 glass-effect shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">P/L History (Blockchain)</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => window.open(getContractEtherscanUrl(), '_blank')}
            variant="outline"
            size="sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Contract
          </Button>
          <Button
            onClick={fetchPnLHistory}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Total P/L Summary */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total P/L</p>
            <p className={`text-2xl font-bold ${getPnLColor(totalPnL)}`}>
              {formatCurrency(totalPnL)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {totalPnL >= 0 ? (
              <TrendingUp className="h-8 w-8 text-green-600" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-600" />
            )}
            <Badge variant={getPnLBadgeVariant(totalPnL)}>
              {totalPnL >= 0 ? 'Profit' : 'Loss'}
            </Badge>
          </div>
        </div>
      </div>

      {/* P/L History List */}
      <div className="space-y-4">
        {pnlHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No P/L records found on blockchain</p>
            <p className="text-sm">Complete buy/sell cycles to see P/L calculations</p>
          </div>
        ) : (
          pnlHistory.map((pnl, index) => (
            <div key={index} className="p-4 border border-border/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{pnl.tokenSymbol}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatTimestamp(pnl.sellTimestamp)}
                  </span>
                </div>
                <Badge variant={getPnLBadgeVariant(pnl.netProfitOrLoss)}>
                  {pnl.netProfitOrLoss >= 0 ? '+' : ''}{formatCurrency(pnl.netProfitOrLoss)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Buy Amount</p>
                  <p className="font-medium">{ethers.formatEther(pnl.buyAmount)} {pnl.tokenSymbol}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sell Amount</p>
                  <p className="font-medium">{ethers.formatEther(pnl.sellAmount)} {pnl.tokenSymbol}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Buy Cost</p>
                  <p className="font-medium">{formatCurrency(pnl.totalBuyCost)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sell Revenue</p>
                  <p className="font-medium">{formatCurrency(pnl.totalSellRevenue)}</p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Capital Deployed: {formatCurrency(pnl.capitalDeployed)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default PnLDisplay;
