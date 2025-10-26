import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Server } from "lucide-react";
import { dbManager, DatabaseType } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

const DatabaseSwitcher = () => {
  const [currentDb, setCurrentDb] = useState<DatabaseType>('supabase');
  const [isSwitching, setIsSwitching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentDb(dbManager.getCurrentType());
  }, []);

  const handleSwitchDatabase = async (type: DatabaseType) => {
    if (type === currentDb) return;

    setIsSwitching(true);
    try {
      await dbManager.switchDatabase(type);
      setCurrentDb(type);

      toast({
        title: "Database switched",
        description: `Successfully switched to ${type === 'supabase' ? 'Supabase' : 'MongoDB'}`,
      });
    } catch (error: any) {
      toast({
        title: "Switch failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <Card className="p-4 glass-effect shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <Database className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Database</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span className="text-sm font-medium">Supabase</span>
          </div>
          <div className="flex items-center gap-2">
            {currentDb === 'supabase' && <Badge variant="default">Active</Badge>}
            <Button
              onClick={() => handleSwitchDatabase('supabase')}
              disabled={isSwitching || currentDb === 'supabase'}
              variant={currentDb === 'supabase' ? 'default' : 'outline'}
              size="sm"
            >
              {isSwitching ? 'Switching...' : 'Use'}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span className="text-sm font-medium">MongoDB</span>
          </div>
          <div className="flex items-center gap-2">
            {currentDb === 'mongodb' && <Badge variant="default">Active</Badge>}
            <Button
              onClick={() => handleSwitchDatabase('mongodb')}
              disabled={isSwitching || currentDb === 'mongodb'}
              variant={currentDb === 'mongodb' ? 'default' : 'outline'}
              size="sm"
            >
              {isSwitching ? 'Switching...' : 'Use'}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> MongoDB integration requires a backend API and is currently disabled for browser compatibility.
          Only Supabase is available for now.
        </p>
      </div>
    </Card>
  );
};

export default DatabaseSwitcher;
