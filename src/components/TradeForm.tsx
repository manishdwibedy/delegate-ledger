import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const totalValue = parseFloat(amount) * parseFloat(price);

      const { error } = await supabase.from("trades").insert([{
        user_id: user.id,
        asset: asset as any,
        trade_type: tradeType,
        amount: parseFloat(amount),
        price_usd: parseFloat(price),
        total_value_usd: totalValue,
        fee_usd: parseFloat(fee),
        notes: notes || null,
        executed_at: new Date(executedAt).toISOString(),
      }]);

      if (error) throw error;

      toast({
        title: "Trade recorded!",
        description: `${tradeType.toUpperCase()}: ${amount} ${asset} @ $${price}`,
      });

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
