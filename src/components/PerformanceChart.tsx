import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const PerformanceChart = () => {
  // Mock performance data
  const data = [
    { date: "Jan 1", value: 10000, pnl: 0 },
    { date: "Jan 5", value: 10120, pnl: 120 },
    { date: "Jan 10", value: 10250, pnl: 250 },
    { date: "Jan 15", value: 10180, pnl: 180 },
    { date: "Jan 20", value: 10420, pnl: 420 },
    { date: "Jan 25", value: 10650, pnl: 650 },
    { date: "Jan 30", value: 10580, pnl: 580 },
    { date: "Feb 5", value: 10820, pnl: 820 },
    { date: "Feb 10", value: 11050, pnl: 1050 },
    { date: "Feb 15", value: 11280, pnl: 1280 },
    { date: "Feb 20", value: 11450, pnl: 1450 },
    { date: "Today", value: 12450, pnl: 2450 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect p-3 rounded-lg shadow-card border border-border/50">
          <p className="text-sm font-medium mb-1">{payload[0].payload.date}</p>
          <p className="text-sm text-muted-foreground">
            Value: <span className="text-foreground font-semibold">${payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-sm text-success">
            P&L: +${payload[0].payload.pnl.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 glass-effect shadow-card">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Performance Overview</h3>
        <p className="text-sm text-muted-foreground">
          Portfolio value and P&L over time (simulated data)
        </p>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Initial Value</p>
          <p className="text-lg font-semibold">$10,000</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Current Value</p>
          <p className="text-lg font-semibold text-primary">$12,450</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Total Return</p>
          <p className="text-lg font-semibold text-success">+24.5%</p>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceChart;
