import { useState } from "react";
import { dbManager } from "@/lib/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, ExternalLink } from "lucide-react";
import { ethers } from "ethers";
import { tradeLoggerContract, getTransactionEtherscanUrl } from "@/lib/contract";

const CRYPTO_ASSETS = [
  "BTC", "ETH", "SOL", "USDC", "USDT", "MATIC", 
  "AVAX", "DOT", "LINK", "UNI", "AAVE", "other"
];

interface TradeFormProps {
  onTradeAdded: () => void;
}

export const TradeForm = ({ onTradeAdded }: TradeFormProps) => {
  const [asset, setAsset] = useState("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [fee, setFee] = useState("0");
  const [notes, setNotes] = useState("");
  const [executedAt, setExecutedAt] = useState(new Date().toISOString().slice(0, 16));
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const adapter = dbManager.getAdapter();
      const user = await adapter.getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      const totalValue = parseFloat(amount) * parseFloat(price);

      // Record trade in database
      const tradeData = await adapter.createTrade({
        user_id: user.id,
        asset: asset as any,
        trade_type: tradeType,
        amount: parseFloat(amount),
        price_usd: parseFloat(price),
        total_value_usd: totalValue,
        fee_usd: parseFloat(fee),
        notes: notes || null,
        executed_at: new Date(executedAt).toISOString(),
      });

      // Log trade to smart contract if wallet is connected
      let transactionHash: string | null = null;
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          // Initialize contract with signer
          tradeLoggerContract.initialize(provider, signer);

          // Log trade to contract
          const isBuy = tradeType === "buy";
          const tx = await tradeLoggerContract.logTrade(asset, parseFloat(amount), parseFloat(price), isBuy);
          transactionHash = tx.hash;

          // Update the trade record with transaction hash
          const adapter = dbManager.getAdapter();
          if (adapter.updateTrade) {
            try {
              await adapter.updateTrade(tradeData[0].id, { transaction_hash: transactionHash });
            } catch (updateError) {
              console.error("Failed to update trade with transaction hash:", updateError);
            }
          }

          toast({
            title: "Trade recorded on blockchain!",
            description: (
              <div className="flex items-center gap-2">
                <span>Logged to smart contract: {tradeType.toUpperCase()} {amount} {asset}</span>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() => window.open(getTransactionEtherscanUrl(transactionHash!), '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View TX
                </Button>
              </div>
            ),
          });
        }
      } catch (contractError: any) {
        console.error("Failed to log trade to contract:", contractError);
        // Don't fail the whole operation if contract logging fails
        toast({
          title: "Trade recorded (database only)",
          description: "Database saved but blockchain logging failed. Check wallet connection.",
          variant: "default",
        });
      }

      // Reset form
      setAsset("");
      setAmount("");
      setPrice("");
      setFee("0");
      setNotes("");
      setExecutedAt(new Date().toISOString().slice(0, 16));

      onTradeAdded();
    } catch (error: any) {
      toast({
        title: "Failed to record trade",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 glass-effect shadow-card">
      <div className="flex items-center gap-2 mb-6">
        <Plus className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Record New Trade</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="asset">Asset</Label>
            <Select value={asset} onValueChange={setAsset} required>
              <SelectTrigger>
                <SelectValue placeholder="Select crypto" />
              </SelectTrigger>
              <SelectContent>
                {CRYPTO_ASSETS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={tradeType} onValueChange={(v: any) => setTradeType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.00000001"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fee">Fee (USD)</Label>
            <Input
              id="fee"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="executedAt">Execution Time</Label>
            <Input
              id="executedAt"
              type="datetime-local"
              value={executedAt}
              onChange={(e) => setExecutedAt(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add notes about this trade..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Record Trade
        </Button>
      </form>
    </Card>
  );
};
