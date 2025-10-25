import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, CheckCircle2, Clock } from "lucide-react";

const TransactionHistory = () => {
  const transactions = [
    {
      id: "1",
      type: "Performance Record",
      amount: "+$45.20",
      status: "confirmed",
      timestamp: "2025-01-25 14:32",
      txHash: "0x1a2b...3c4d",
      gasUsed: "0.0012 ETH",
    },
    {
      id: "2",
      type: "Delegation Approved",
      amount: "8,500 MOCK",
      status: "confirmed",
      timestamp: "2025-01-20 09:15",
      txHash: "0x5e6f...7g8h",
      gasUsed: "0.0015 ETH",
    },
    {
      id: "3",
      type: "Performance Record",
      amount: "+$28.50",
      status: "confirmed",
      timestamp: "2025-01-18 16:45",
      txHash: "0x9i0j...1k2l",
      gasUsed: "0.0011 ETH",
    },
    {
      id: "4",
      type: "Performance Record",
      amount: "-$12.30",
      status: "confirmed",
      timestamp: "2025-01-15 11:20",
      txHash: "0x3m4n...5o6p",
      gasUsed: "0.0013 ETH",
    },
    {
      id: "5",
      type: "Performance Record",
      amount: "+$67.80",
      status: "pending",
      timestamp: "2025-01-10 08:30",
      txHash: "0x7q8r...9s0t",
      gasUsed: "0.0012 ETH",
    },
  ];

  return (
    <Card className="p-6 glass-effect shadow-card">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Transaction History</h3>
        <p className="text-sm text-muted-foreground">
          On-chain records of delegations and performance updates
        </p>
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => {
          const isPositive = tx.amount.startsWith("+");
          const isNegative = tx.amount.startsWith("-");
          
          return (
            <div
              key={tx.id}
              className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isPositive ? 'bg-success/10' : isNegative ? 'bg-destructive/10' : 'bg-primary/10'
                  }`}>
                    {isPositive ? (
                      <ArrowUpRight className="h-4 w-4 text-success" />
                    ) : isNegative ? (
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{tx.type}</p>
                    <p className="text-sm text-muted-foreground">{tx.timestamp}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${
                    isPositive ? 'text-success' : isNegative ? 'text-destructive' : 'text-foreground'
                  }`}>
                    {tx.amount}
                  </p>
                  <Badge 
                    variant={tx.status === "confirmed" ? "default" : "secondary"}
                    className={tx.status === "confirmed" 
                      ? "bg-success/10 text-success border-success/20 mt-1" 
                      : "bg-warning/10 text-warning border-warning/20 mt-1"
                    }
                  >
                    {tx.status === "confirmed" ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {tx.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/30">
                <span className="font-mono">{tx.txHash}</span>
                <span>Gas: {tx.gasUsed}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
        <p className="text-xs text-muted-foreground mb-2">Smart Contract</p>
        <p className="text-sm font-mono break-all mb-2">PerformanceTracker.sol</p>
        <p className="text-xs text-muted-foreground">
          All performance metrics are recorded immutably on Ethereum mainnet
        </p>
      </div>
    </Card>
  );
};

export default TransactionHistory;
