import { useState, useEffect } from "react";
import { dbManager } from "@/lib/database";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { getTransactionEtherscanUrl } from "@/lib/contract";

interface Trade {
  id: string;
  asset: string;
  trade_type: "buy" | "sell";
  amount: number;
  price_usd: number;
  total_value_usd: number;
  fee_usd: number;
  notes: string | null;
  executed_at: string;
  transaction_hash?: string | null;
}

interface TradesListProps {
  refreshTrigger: number;
}

export const TradesList = ({ refreshTrigger }: TradesListProps) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTrades = async () => {
    try {
      const adapter = dbManager.getAdapter();
      const user = await adapter.getCurrentUser();
      if (!user) {
        setTrades([]);
        return;
      }
      const data = await adapter.getTrades(user.id);
      setTrades(data || []);
    } catch (error: any) {
      toast({
        title: "Failed to load trades",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      const adapter = dbManager.getAdapter();
      await adapter.deleteTrade(id);

      toast({
        title: "Trade deleted",
        description: "Trade removed from history",
      });

      fetchTrades();
    } catch (error: any) {
      toast({
        title: "Failed to delete trade",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <Card className="p-6 glass-effect shadow-card">Loading trades...</Card>;
  }

  if (trades.length === 0) {
    return (
      <Card className="p-6 glass-effect shadow-card text-center">
        <p className="text-muted-foreground">No trades recorded yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 glass-effect shadow-card">
      <h3 className="text-xl font-semibold mb-6">Trade History</h3>
      
      <div className="space-y-3">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  trade.trade_type === "buy" 
                    ? "bg-success/10" 
                    : "bg-destructive/10"
                }`}>
                  {trade.trade_type === "buy" ? (
                    <ArrowDownRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-destructive" />
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{trade.asset}</p>
                    <Badge variant={trade.trade_type === "buy" ? "default" : "secondary"}>
                      {trade.trade_type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(trade.executed_at), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {trade.amount} @ ${trade.price_usd.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total: ${trade.total_value_usd.toLocaleString()}
                </p>
              </div>
            </div>

            {trade.notes && (
              <p className="text-sm text-muted-foreground mt-2 pl-11">
                {trade.notes}
              </p>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  Fee: ${trade.fee_usd.toFixed(2)}
                </p>
                {trade.transaction_hash && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => window.open(getTransactionEtherscanUrl(trade.transaction_hash!), '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    TX
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(trade.id)}
                className="h-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
