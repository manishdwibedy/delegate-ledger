import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DelegationPanel = () => {
  const [amount, setAmount] = useState("");
  const [delegated, setDelegated] = useState(false);
  const { toast } = useToast();

  const handleDelegate = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid delegation amount",
        variant: "destructive",
      });
      return;
    }

    // Simulate ERC-20 approve transaction
    toast({
      title: "Transaction Submitted",
      description: "Approving delegation to Manager Wallet...",
    });

    setTimeout(() => {
      setDelegated(true);
      toast({
        title: "Delegation Successful",
        description: `${amount} MOCK tokens approved for delegation`,
      });
    }, 2000);
  };

  const handleRevoke = () => {
    setDelegated(false);
    setAmount("");
    toast({
      title: "Delegation Revoked",
      description: "Manager authority has been removed",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 glass-effect shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Delegate Assets</h3>
          <Badge variant={delegated ? "default" : "secondary"} className="bg-primary/10 text-primary border-primary/20">
            {delegated ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
              Delegation Amount
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={delegated}
                className="pr-20 bg-muted/50 border-border/50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                MOCK
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Available balance: 12,450.00 MOCK
            </p>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Non-Custodial Delegation</p>
                <p className="text-xs text-muted-foreground">
                  Your funds remain in your wallet. The Manager can only execute trades up to the approved amount using ERC-20 approve() mechanism.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Manager Address</span>
              <span className="font-mono">0x1a2b...7c8d</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Performance Fee</span>
              <span>5% of profits</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network</span>
              <span>Ethereum Mainnet</span>
            </div>
          </div>

          {!delegated ? (
            <Button 
              onClick={handleDelegate} 
              className="w-full gradient-primary shadow-glow hover:opacity-90"
            >
              Approve Delegation
            </Button>
          ) : (
            <Button 
              onClick={handleRevoke} 
              variant="destructive"
              className="w-full"
            >
              Revoke Delegation
            </Button>
          )}
        </div>
      </Card>

      <Card className="p-6 glass-effect shadow-card">
        <h3 className="text-xl font-semibold mb-6">Delegation Status</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
            {delegated ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium">
                {delegated ? "Delegation Active" : "No Active Delegation"}
              </p>
              <p className="text-sm text-muted-foreground">
                {delegated 
                  ? `${amount} MOCK tokens approved for trading`
                  : "Approve tokens to start delegated trading"
                }
              </p>
            </div>
          </div>

          {delegated && (
            <>
              <div className="space-y-3 pt-4 border-t border-border/50">
                <h4 className="text-sm font-semibold">Recent Activity</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 text-sm">
                    <span className="text-muted-foreground">Delegation Approved</span>
                    <span className="font-medium text-success">+{amount} MOCK</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 text-sm">
                    <span className="text-muted-foreground">Daily P&L</span>
                    <span className="font-medium text-success">+0.8%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 text-sm">
                    <span className="text-muted-foreground">Performance Recorded</span>
                    <span className="font-medium text-primary">On-chain</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-success/5 border border-success/10">
                <p className="text-xs text-muted-foreground mb-2">Smart Contract</p>
                <p className="text-sm font-mono break-all">0x742d35Cc6634C0532925a3b844Bc9e7595f42a5f3a</p>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DelegationPanel;
