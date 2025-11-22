import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Brain, Zap, Clock } from 'lucide-react';

const data = [
    { name: 'Mon', flow: 40, focus: 24, amt: 2400 },
    { name: 'Tue', flow: 30, focus: 13, amt: 2210 },
    { name: 'Wed', flow: 20, focus: 98, amt: 2290 },
    { name: 'Thu', flow: 27, focus: 39, amt: 2000 },
    { name: 'Fri', flow: 18, focus: 48, amt: 2181 },
    { name: 'Sat', flow: 23, focus: 38, amt: 2500 },
    { name: 'Sun', flow: 34, focus: 43, amt: 2100 },
];

export default function Analytics() {
    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto font-sans">
            <header className="mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Flow State Analytics
                </h1>
                <p className="text-slate-400 mt-2">Weekly Performance & Cognitive Load Analysis</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard icon={<Activity />} title="Flow Score" value="78" trend="+12%" />
                <StatCard icon={<Clock />} title="Deep Work" value="4h 12m" trend="+30m" />
                <StatCard icon={<Brain />} title="Cognitive Load" value="Medium" trend="Stable" />
                <StatCard icon={<Zap />} title="Interventions" value="12" trend="-3" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-semibold mb-6">Flow State Trends</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="flow" stroke="#8884d8" fillOpacity={1} fill="url(#colorFlow)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-semibold mb-6">Distraction Sources</h3>
                    <div className="space-y-4">
                        <DistractionItem name="Social Media" value={45} color="bg-red-500" />
                        <DistractionItem name="Email" value={30} color="bg-yellow-500" />
                        <DistractionItem name="News" value={15} color="bg-blue-500" />
                        <DistractionItem name="Other" value={10} color="bg-slate-500" />
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-semibold mb-4">AI Insights</h3>
                <div className="flex gap-4 items-start">
                    <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                        <Brain size={24} />
                    </div>
                    <div>
                        <p className="text-lg font-medium">Peak Performance Window</p>
                        <p className="text-slate-400 mt-1">
                            Your flow state consistently peaks between 10:00 AM and 11:30 AM.
                            Consider scheduling your most demanding tasks during this window.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, trend }: any) {
    return (
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-lg text-slate-300">
                    {icon}
                </div>
                <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {trend}
                </span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
            <p className="text-3xl font-light mt-1">{value}</p>
        </div>
    );
}

function DistractionItem({ name, value, color }: any) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">{name}</span>
                <span className="text-slate-500">{value}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}
