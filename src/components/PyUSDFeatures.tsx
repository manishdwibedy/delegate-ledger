import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Shield, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

const PyUSDFeatures = () => {
  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      title: "Price Stability",
      description: "Maintains $1.00 peg with minimal volatility, perfect for delegation limits and performance tracking."
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: "PayPal Backing",
      description: "Backed by PayPal's balance sheet and regulatory compliance, providing institutional-grade security."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-purple-500" />,
      title: "Yield Opportunities",
      description: "Earn yield through PayPal's ecosystem while maintaining delegation authority."
    },
    {
      icon: <Clock className="h-6 w-6 text-orange-500" />,
      title: "Fast Settlements",
      description: "Near-instant transfers and settlements, ideal for active delegated trading strategies."
    }
  ];

  const delegationAdvantages = [
    "Set precise delegation limits without volatility concerns",
    "Track performance in stable dollars for accurate P&L",
    "Reduce risk exposure in delegated trading scenarios",
    "Maintain purchasing power during market volatility",
    "Enable algorithmic delegation strategies with predictable values"
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 glass-effect shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">PyUSD Features</h3>
              <p className="text-sm text-muted-foreground">PayPal's USD Stablecoin</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
            Stablecoin
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
              {benefit.icon}
              <div>
                <h4 className="font-medium mb-1">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Delegation Advantages
          </h4>
          <ul className="space-y-2">
            {delegationAdvantages.map((advantage, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>{advantage}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card className="p-6 glass-effect shadow-card">
        <h3 className="text-lg font-semibold mb-4">PyUSD in Delegated Trading</h3>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <h4 className="font-medium mb-2 text-blue-700 dark:text-blue-300">Stable Delegation Limits</h4>
            <p className="text-sm text-muted-foreground">
              Set delegation amounts in PyUSD knowing the value won't fluctuate. A $10,000 delegation limit
              remains $10,000 worth of authority, regardless of market conditions.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/10">
            <h4 className="font-medium mb-2 text-purple-700 dark:text-purple-300">Accurate Performance Tracking</h4>
            <p className="text-sm text-muted-foreground">
              Track trading performance in stable dollars. When managers execute trades, P&L calculations
              remain meaningful and comparable over time.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/10">
            <h4 className="font-medium mb-2 text-green-700 dark:text-green-300">Risk Management</h4>
            <p className="text-sm text-muted-foreground">
              Use PyUSD for stop-loss mechanisms and position sizing. Managers can implement risk controls
              with predictable dollar amounts.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/30">
          <h4 className="font-medium mb-2">Example Use Case</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Client delegates $50,000 PyUSD to a manager for crypto trading. The manager can execute trades
            up to this stable limit while the client maintains full custody of their PyUSD tokens.
          </p>
          <Button variant="outline" size="sm" className="w-full">
            Try PyUSD Delegation
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PyUSDFeatures;
