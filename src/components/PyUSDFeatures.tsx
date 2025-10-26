import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Shield, TrendingUp, Clock, CheckCircle2, CreditCard, PiggyBank, Lock, Zap } from "lucide-react";

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
    },
    {
      icon: <CreditCard className="h-6 w-6 text-indigo-500" />,
      title: "PayPal Integration",
      description: "Seamlessly connect with PayPal for instant transfers, merchant payments, and wallet bridging."
    },
    {
      icon: <PiggyBank className="h-6 w-6 text-yellow-500" />,
      title: "Advanced Yield",
      description: "Access enhanced yield through staking, lending pools, and ecosystem rewards beyond basic interest."
    },
    {
      icon: <Lock className="h-6 w-6 text-red-500" />,
      title: "Enhanced Security",
      description: "Built-in KYC compliance, audit trails, and multi-signature support for high-value delegations."
    },
    {
      icon: <Zap className="h-6 w-6 text-cyan-500" />,
      title: "Instant Liquidity",
      description: "Convert to/from fiat instantly through PayPal's network, enabling real-time financial operations."
    }
  ];

  const delegationAdvantages = [
    "Set precise delegation limits without volatility concerns",
    "Track performance in stable dollars for accurate P&L",
    "Reduce risk exposure in delegated trading scenarios",
    "Maintain purchasing power during market volatility",
    "Enable algorithmic delegation strategies with predictable values",
    "Instant fiat conversion for emergency withdrawals",
    "Multi-signature approvals for large delegation amounts",
    "Automated yield compounding on delegated funds",
    "Real-time compliance monitoring and reporting"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-muted/30">
            <h4 className="font-medium mb-2">Example Use Case</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Client delegates $50,000 PyUSD to a manager for crypto trading. The manager can execute trades
              up to this stable limit while the client maintains full custody of their PyUSD tokens.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Try PyUSD Delegation
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/10">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-indigo-500" />
              PayPal Integration Features
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Direct transfers between PayPal accounts and PyUSD wallets</li>
              <li>• Merchant payment processing with instant settlement</li>
              <li>• Seamless bridging for cross-border transactions</li>
              <li>• Automated reconciliation with PayPal statements</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border border-yellow-500/10">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-yellow-500" />
              Advanced Yield Opportunities
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Staking rewards through PayPal's liquidity pools</li>
              <li>• Lending protocols with competitive APYs</li>
              <li>• Ecosystem incentives for long-term holding</li>
              <li>• Automated yield farming strategies</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-r from-red-500/5 to-pink-500/5 border border-red-500/10">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-500" />
              Security & Compliance
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Integrated KYC verification for all transactions</li>
              <li>• Immutable audit trails for regulatory reporting</li>
              <li>• Multi-signature support for institutional delegations</li>
              <li>• Real-time compliance monitoring and alerts</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PyUSDFeatures;
