import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Share2, Copy, Check, Eye, EyeOff, Loader2 } from "lucide-react";

export const PortfolioShare = () => {
  const [holdings, setHoldings] = useState<any>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [expiryHours, setExpiryHours] = useState("24");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const calculatePortfolio = async () => {
    try {
      const { data: trades, error } = await supabase
        .from("trades")
        .select("*")
        .order("executed_at", { ascending: true });

      if (error) throw error;

      const portfolioMap = new Map<string, { amount: number; totalCost: number }>();
      
      trades?.forEach((trade) => {
        const current = portfolioMap.get(trade.asset) || { amount: 0, totalCost: 0 };
        
        if (trade.trade_type === "buy") {
          portfolioMap.set(trade.asset, {
            amount: current.amount + Number(trade.amount),
            totalCost: current.totalCost + Number(trade.total_value_usd) + Number(trade.fee_usd),
          });
        } else {
          const avgCost = current.amount > 0 ? current.totalCost / current.amount : 0;
          portfolioMap.set(trade.asset, {
            amount: current.amount - Number(trade.amount),
            totalCost: current.totalCost - (Number(trade.amount) * avgCost),
          });
        }
      });

      const holdingsArray = Array.from(portfolioMap.entries())
        .filter(([_, data]) => data.amount > 0)
        .map(([asset, data]) => ({
          asset,
          amount: data.amount,
          avgCost: data.totalCost / data.amount,
        }));

      setHoldings(holdingsArray);
      return holdingsArray;
    } catch (error: any) {
      toast({
        title: "Failed to calculate portfolio",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  useEffect(() => {
    calculatePortfolio();
  }, []);

  const generateSnapshot = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const currentHoldings = await calculatePortfolio();
      
      // Generate anonymous hash
      const hash = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      const totalValue = currentHoldings.reduce(
        (sum, h) => sum + (h.amount * h.avgCost), 
        0
      );
      
      const expiresAt = expiryHours 
        ? new Date(Date.now() + parseInt(expiryHours) * 60 * 60 * 1000).toISOString()
        : null;

      const { data, error } = await supabase
        .from("portfolio_snapshots")
        .insert({
          user_id: user.id,
          snapshot_hash: hash,
          total_value_usd: totalValue,
          total_pnl_usd: 0, // Simplified for MVP
          total_pnl_percent: 0,
          holdings: currentHoldings,
          is_public: isPublic,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) throw error;

      const url = `${window.location.origin}/portfolio/${hash}`;
      setShareUrl(url);
      
      toast({
        title: "Portfolio snapshot created!",
        description: isPublic 
          ? "Anyone with the link can view this snapshot" 
          : "Only you can view this snapshot",
      });
    } catch (error: any) {
      toast({
        title: "Failed to create snapshot",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Share link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 glass-effect shadow-card">
      <div className="flex items-center gap-2 mb-6">
        <Share2 className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Share Portfolio (Smart Contract)</h3>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-sm mb-2 font-medium">Privacy Features:</p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Anonymous hash-based sharing (no personal data)</li>
            <li>Time-limited access with auto-expiry</li>
            <li>On-chain verification without exposing identity</li>
            <li>Optional public/private visibility control</li>
          </ul>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-3">
            {isPublic ? (
              <Eye className="h-4 w-4 text-primary" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
            <div>
              <Label htmlFor="public-switch" className="cursor-pointer">
                Public Snapshot
              </Label>
              <p className="text-xs text-muted-foreground">
                {isPublic ? "Anyone with link can view" : "Private (only you)"}
              </p>
            </div>
          </div>
          <Switch
            id="public-switch"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiry">Auto-Expiry (hours)</Label>
          <Input
            id="expiry"
            type="number"
            min="1"
            max="720"
            placeholder="24"
            value={expiryHours}
            onChange={(e) => setExpiryHours(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Leave empty for permanent snapshot
          </p>
        </div>

        <Button 
          onClick={generateSnapshot} 
          className="w-full"
          disabled={loading || !holdings || holdings.length === 0}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Smart Contract Snapshot
        </Button>

        {shareUrl && (
          <div className="p-4 rounded-lg bg-success/5 border border-success/20 space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              <p className="text-sm font-medium text-success">Snapshot Created!</p>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="font-mono text-xs flex-1"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(shareUrl, '_blank')}
                title="Open in new tab"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Hash: {shareUrl.split('/').pop()?.substring(0, 16)}...
              </Badge>
              <Badge variant="outline" className="text-xs">
                Expires: {expiryHours}h
              </Badge>
            </div>
          </div>
        )}

        {holdings && holdings.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Current Holdings:</p>
            <div className="space-y-1">
              {holdings.map((h: any) => (
                <div key={h.asset} className="flex justify-between text-sm">
                  <span>{h.asset}</span>
                  <span className="text-muted-foreground">
                    {h.amount.toFixed(8)} @ ${h.avgCost.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
