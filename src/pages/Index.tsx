import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, TrendingUp, Shield, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import DelegationPanel from "@/components/DelegationPanel";
import PerformanceChart from "@/components/PerformanceChart";
import TransactionHistory from "@/components/TransactionHistory";
import StatsOverview from "@/components/StatsOverview";

const Index = () => {
  const [walletConnected, setWalletConnected] = useState(false);

  const handleConnectWallet = () => {
    setWalletConnected(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 glass-effect">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">DelegateX</h1>
              <p className="text-xs text-muted-foreground">Non-Custodial Trading</p>
            </div>
          </div>
          
          <Button 
            onClick={handleConnectWallet}
            className="gradient-primary shadow-glow hover:opacity-90 transition-opacity"
          >
            <Wallet className="h-4 w-4 mr-2" />
            {walletConnected ? "0x742d...5f3a" : "Connect Wallet"}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">V1.0 MVP - Proof of Concept</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Delegated Trading,
            <br />
            Verified On-Chain
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8">
            Grant limited, non-custodial trading authority while maintaining full asset control.
            Performance metrics recorded immutably on Ethereum.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="p-6 glass-effect shadow-card hover:shadow-glow transition-all">
              <Shield className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Non-Custodial</h3>
              <p className="text-sm text-muted-foreground">Your assets never leave your wallet</p>
            </Card>
            
            <Card className="p-6 glass-effect shadow-card hover:shadow-glow transition-all">
              <Activity className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Transparent</h3>
              <p className="text-sm text-muted-foreground">All performance tracked on-chain</p>
            </Card>
            
            <Card className="p-6 glass-effect shadow-card hover:shadow-glow transition-all">
              <TrendingUp className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Verifiable</h3>
              <p className="text-sm text-muted-foreground">Immutable performance records</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      {walletConnected && (
        <section className="container mx-auto px-4 pb-20">
          <StatsOverview />
          
          <Tabs defaultValue="overview" className="mt-8">
            <TabsList className="glass-effect">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="delegation">Delegation</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-6">
              <PerformanceChart />
            </TabsContent>
            
            <TabsContent value="delegation" className="mt-6">
              <DelegationPanel />
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <TransactionHistory />
            </TabsContent>
          </Tabs>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 DelegateX. Hackathon MVP - Educational purposes only.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="hover:text-primary transition-colors">Smart Contracts</a>
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
