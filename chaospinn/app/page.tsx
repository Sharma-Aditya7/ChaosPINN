"use client";
  
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Waves, Settings, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThreeScene from '@/components/ThreeScene';
import ControlPanel from '@/components/ControlPanel';
import { fetchSimulationData } from '@/lib/api';

export default function Home() {
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSimulationData();
        if (data) {
          setSimulationData(data);
          setError(null);
        } else {
          setError('Unable to connect to the simulation server. Please ensure the FastAPI backend is running on http://localhost:8000');
        }
      } catch (error) {
        console.error('Failed to fetch simulation data:', error);
        setError('Unable to connect to the simulation server. Please ensure the FastAPI backend is running on http://localhost:8000');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2 flex items-center gap-2">
            <Brain className="w-8 h-8" />
            KS Equation PINN Solver
          </h1>
          <p className="text-muted-foreground">
            Physics-Informed Neural Network solution for the Kuramoto-Sivashinsky equation
          </p>
        </header>

        {error && (
          <Card className="mb-8 p-4 border-destructive bg-destructive/10">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </Card>
        )}

        <Tabs defaultValue="visualization" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="visualization" className="flex items-center gap-2">
              <Waves className="w-4 h-4" />
              Visualization
            </TabsTrigger>
            <TabsTrigger value="controls" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Controls
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualization" className="space-y-4">
            <Card className="p-0 overflow-hidden aspect-[16/9] relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <p className="text-muted-foreground">Loading simulation...</p>
                </div>
              ) : (
                <ThreeScene simulationData={simulationData} />
              )}
            </Card>
          </TabsContent>

          <TabsContent value="controls">
            <Card className="p-6">
              <ControlPanel />
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}