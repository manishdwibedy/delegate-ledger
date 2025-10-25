import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet } from "lucide-react";

const StatsOverview = () => {
  const stats = [
    {
      label: "Total Value Locked",
      value: "$12,450.00",
      change: "+5.2%",
      positive: true,
      icon: Wallet,
    },
    {
      label: "Delegated Amount",
      value: "$8,500.00",
      change: "68.3%",
      positive: true,
      icon: TrendingUp,
      subtext: "of TVL",
    },
    {
      label: "Net P&L (30d)",
      value: "+$324.50",
      change: "+3.8%",
      positive: true,
      icon: ArrowUpRight,
    },
    {
      label: "Performance Fee",
      value: "$16.23",
      change: "5% of profits",
      positive: false,
      icon: ArrowDownRight,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-6 glass-effect shadow-card hover:shadow-glow transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.positive ? 'bg-success/10' : 'bg-muted/50'}`}>
                <Icon className={`h-5 w-5 ${stat.positive ? 'text-success' : 'text-muted-foreground'}`} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                stat.positive ? 'bg-success/10 text-success' : 'bg-muted/50 text-muted-foreground'
              }`}>
                {stat.change}
              </span>
            </div>
            
            <div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">
                {stat.label}
                {stat.subtext && <span className="text-xs ml-1">({stat.subtext})</span>}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsOverview;
