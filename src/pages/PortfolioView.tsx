import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TrendingUp, Eye, EyeOff, Clock, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

const PortfolioView = () => {
  const { hash } = useParams<{ hash: string }>();
  const [snapshot, setSnapshot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchSnapshot = async () => {
      if (!hash) {
        setError("Invalid portfolio link");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("portfolio_snapshots")
          .select("*")
          .eq("snapshot_hash", hash)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            setError("Portfolio snapshot not found");
          } else {
            setError("Failed to load portfolio");
          }
          setLoading(false);
          return;
        }

        // Check if snapshot is expired
        if (data.expires_at) {
          const expiryDate = new Date(data.expires_at);
          const now = new Date();
          // Add 1 minute buffer to account for any timing differences
          const bufferTime = 60 * 1000; // 1 minute in milliseconds

          if (expiryDate.getTime() + bufferTime < now.getTime()) {
            setError("This portfolio snapshot has expired");
            setLoading(false);
            return;
          }
        }

        // Check if private snapshot and user is not authenticated
        if (!data.is_public && !user) {
          setError("This portfolio is private. Please sign in to view it.");
          setLoading(false);
          return;
        }

        // Check if private snapshot and user doesn't own it
        if (!data.is_public && user && data.user_id !== user.id) {
          setError("You don't have permission to view this portfolio");
          setLoading(false);
          return;
        }

        setSnapshot(data);
      } catch (err: any) {
        setError("Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    };

    fetchSnapshot();
  }, [hash, user]);

  // Auto-refresh expiry time every minute
  useEffect(() => {
    if (!autoRefresh || !snapshot) return;

    const interval = setInterval(() => {
      // Force re-render to update expiry time display
      setSnapshot({ ...snapshot });
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [autoRefresh, snapshot]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <Card className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Portfolio Not Available</h1>
            <Alert className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Link to="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to DelegateX
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  if (!snapshot) return null;

  const holdings = snapshot.holdings || [];
  const totalValue = snapshot.total_value_usd || 0;
  const totalPnL = snapshot.total_pnl_usd || 0;
  const totalPnLPercent = snapshot.total_pnl_percent || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to DelegateX
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Shared Portfolio</h1>
                <p className="text-sm text-muted-foreground">
                  Anonymous portfolio snapshot
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {snapshot.is_public ? (
                <Badge variant="outline" className="text-green-600">
                  <Eye className="h-3 w-3 mr-1" />
                  Public
                </Badge>
              ) : (
                <Badge variant="outline" className="text-orange-600">
                  <EyeOff className="h-3 w-3 mr-1" />
                  Private
                </Badge>
              )}
              {snapshot.expires_at && (
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {(() => {
                    const expiryDate = new Date(snapshot.expires_at);
                    const now = new Date();
                    const timeDiff = expiryDate.getTime() - now.getTime();

                    if (timeDiff <= 0) {
                      return `Expired ${expiryDate.toLocaleString()}`;
                    }

                    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

                    if (hours > 0) {
                      return `Expires in ${hours}h ${minutes}m`;
                    } else if (minutes > 0) {
                      return `Expires in ${minutes}m`;
                    } else {
                      return `Expires soon`;
                    }
                  })()}
                </Badge>
              )}
              <div className="flex items-center gap-2 ml-2">
                <RefreshCw className="h-3 w-3" />
                <Switch
                  id="auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                  size="sm"
                />
                <Label htmlFor="auto-refresh" className="text-xs cursor-pointer">
                  Auto-refresh
                </Label>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Portfolio Overview */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Portfolio Overview</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">Total P&L</p>
                  <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">P&L %</p>
                  <p className={`text-2xl font-bold ${totalPnLPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm mb-2 font-medium">Privacy Features:</p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Anonymous hash-based sharing (no personal data)</li>
                  <li>Time-limited access with auto-expiry</li>
                  <li>On-chain verification without exposing identity</li>
                  <li>Optional public/private visibility control</li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Holdings Summary */}
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Holdings</h3>
              {holdings.length > 0 ? (
                <div className="space-y-3">
                  {holdings.map((holding: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">{holding.asset}</p>
                        <p className="text-sm text-muted-foreground">
                          {holding.amount.toFixed(8)} units
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(holding.amount * holding.avgCost).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          @ ${holding.avgCost.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No holdings in this portfolio
                </p>
              )}
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Shared via DelegateX • Non-custodial trading platform</p>
          <p className="mt-1">
            Created {new Date(snapshot.created_at).toLocaleDateString()} at{' '}
            {new Date(snapshot.created_at).toLocaleTimeString()}
          </p>
        </div>
      </main>
    </div>
  );
};

export default PortfolioView;
