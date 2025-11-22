import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Brain, Zap, Clock } from 'lucide-react';

export default function Analytics() {
    const [flowState, setFlowState] = useState<any>(null);
    const [historicalData, setHistoricalData] = useState<any[]>([]);

    useEffect(() => {
        // Load current flow state
        const loadData = () => {
            chrome.storage.local.get(['flowState', 'historicalData'], (data) => {
                if (data.flowState) {
                    setFlowState(data.flowState);
                }
                if (data.historicalData) {
                    setHistoricalData(data.historicalData);
                } else {
                    // Generate initial data from metrics history if available
                    if (data.flowState?.metricsHistory) {
                        const chartData = data.flowState.metricsHistory.map((m: any, i: number) => ({
                            name: `T${i}`,
                            flow: m.score || 50,
                        }));
                        setHistoricalData(chartData);
                    }
                }
            });
        };

        loadData();
        const interval = setInterval(loadData, 2000);
        return () => clearInterval(interval);
    }, []);

    // Calculate stats from flow state
    const flowScore = flowState ? Math.round(flowState.score) : 0;
    const deepWorkTime = flowState ? Math.floor(flowState.totalActiveSecs / 60) : 0;
    const focusQuality = flowState ? Math.round(flowState.focusQuality || 0) : 0;
    const streakMinutes = flowState ? Math.floor(flowState.streak / 60) : 0;
    
    // Determine cognitive load
    const getCognitiveLoad = () => {
        if (!flowState) return 'Unknown';
        if (flowState.score > 80) return 'High';
        if (flowState.score > 50) return 'Medium';
        return 'Low';
    };

    // Format chart data
    const chartData = historicalData.length > 0 
        ? historicalData 
        : (flowState?.metricsHistory || []).map((m: any, i: number) => ({
            name: `${i}`,
            flow: m.score || 50,
        }));

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto font-sans">
            <header className="mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Flow State Analytics
                </h1>
                <p className="text-slate-400 mt-2">Weekly Performance & Cognitive Load Analysis</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard 
                    icon={<Activity />} 
                    title="Flow Score" 
                    value={flowScore.toString()} 
                    trend={flowState?.status === 'flow' ? '🔥 Flow' : flowState?.status || 'Passive'} 
                />
                <StatCard 
                    icon={<Clock />} 
                    title="Active Time" 
                    value={`${deepWorkTime}m`} 
                    trend={`${streakMinutes}m streak`} 
                />
                <StatCard 
                    icon={<Brain />} 
                    title="Focus Quality" 
                    value={`${focusQuality}%`} 
                    trend={getCognitiveLoad()} 
                />
                <StatCard 
                    icon={<Zap />} 
                    title="Metrics Count" 
                    value={flowState?.metricsHistory?.length || 0} 
                    trend="Live" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-semibold mb-6">Flow State Trends (Last 10 measurements)</h3>
                    <div className="h-[300px]">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="name" stroke="#666" />
                                    <YAxis stroke="#666" domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="flow" stroke="#8884d8" fillOpacity={1} fill="url(#colorFlow)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                                <p>Start working to see your flow state trends...</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-semibold mb-6">Current Metrics</h3>
                    <div className="space-y-4">
                        {flowState?.metricsHistory?.length > 0 ? (
                            <>
                                <MetricItem 
                                    name="Typing Speed" 
                                    value={flowState.metricsHistory[flowState.metricsHistory.length - 1]?.typingCadence || 0} 
                                    unit="cpm"
                                    color="bg-blue-500" 
                                />
                                <MetricItem 
                                    name="Errors" 
                                    value={flowState.metricsHistory[flowState.metricsHistory.length - 1]?.errors || 0} 
                                    unit=""
                                    color="bg-red-500" 
                                />
                                <MetricItem 
                                    name="Mouse Smoothness" 
                                    value={flowState.metricsHistory[flowState.metricsHistory.length - 1]?.mouseSmoothness || 0} 
                                    unit="%"
                                    color="bg-green-500" 
                                />
                                <MetricItem 
                                    name="Tab Switches" 
                                    value={flowState.metricsHistory[flowState.metricsHistory.length - 1]?.switchCount || 0} 
                                    unit=""
                                    color="bg-yellow-500" 
                                />
                            </>
                        ) : (
                            <p className="text-slate-400 text-sm">No metrics data yet...</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-semibold mb-4">Current Status</h3>
                <div className="flex gap-4 items-start">
                    <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                        <Brain size={24} />
                    </div>
                    <div>
                        <p className="text-lg font-medium">
                            {flowState?.status === 'flow' 
                                ? '🎯 In Flow State!' 
                                : flowState?.status === 'active' 
                                ? '⚡ Actively Working' 
                                : flowState?.status === 'distracted'
                                ? '😵 Distracted'
                                : '💤 Passive'}
                        </p>
                        <p className="text-slate-400 mt-1">
                            {flowState?.status === 'flow'
                                ? `Great work! You've been in flow for ${streakMinutes} minutes. Keep it up!`
                                : flowState?.status === 'active'
                                ? 'Building momentum. A few more minutes of focused work to reach flow state.'
                                : flowState?.status === 'distracted'
                                ? 'Try to minimize distractions and focus on one task at a time.'
                                : 'Start working on a task to build your flow state.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, trend }: any) {
    const getTrendColor = () => {
        if (trend.includes('Flow') || trend.includes('🔥')) return 'text-green-400';
        if (trend.startsWith('+')) return 'text-green-400';
        if (trend.startsWith('-')) return 'text-red-400';
        return 'text-slate-400';
    };

    return (
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-lg text-slate-300">
                    {icon}
                </div>
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                    {trend}
                </span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
            <p className="text-3xl font-light mt-1">{value}</p>
        </div>
    );
}

function MetricItem({ name, value, unit, color }: any) {
    const percentage = Math.min(100, (value / 100) * 100);
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">{name}</span>
                <span className="text-slate-500">{value}{unit}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}
