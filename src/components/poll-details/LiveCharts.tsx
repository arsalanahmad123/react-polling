'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from 'recharts';
import { BarChart3, PieChartIcon, TrendingUp } from 'lucide-react';
import type { ChartDataPoint } from '@/types';

interface LiveChartsProps {
    options: string[];
    voteResults: { [key: number]: number };
    selectedOptions: number[];
    totalVotes: number;
}

const COLORS = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#06B6D4',
    '#84CC16',
    '#F97316',
    '#EC4899',
    '#6366F1',
];

export default function LiveCharts({
    options,
    voteResults,
    selectedOptions,
    totalVotes,
}: LiveChartsProps) {
    const chartData: ChartDataPoint[] = options.map((option, index) => {
        const votes = voteResults[index] || 0;
        const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

        return {
            name: option.length > 20 ? `${option.substring(0, 20)}...` : option,
            fullName: option,
            value: votes,
            percentage: Math.round(percentage * 10) / 10,
            color: COLORS[index % COLORS.length],
            isSelected: selectedOptions.includes(index),
        };
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                    <p className="font-medium text-slate-900">
                        {data.fullName}
                    </p>
                    <p className="text-blue-600">{`${data.value} votes (${data.percentage}%)`}</p>
                </div>
            );
        }
        return null;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CustomPieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                    <p className="font-medium text-slate-900">
                        {data.fullName}
                    </p>
                    <p className="text-blue-600">{`${data.value} votes (${data.percentage}%)`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="bg-white/90 shadow-lg backdrop-blur-sm border-0">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Live Results
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="bar" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger
                            value="bar"
                            className="flex items-center gap-2"
                        >
                            <BarChart3 className="w-4 h-4" />
                            Bar Chart
                        </TabsTrigger>
                        <TabsTrigger
                            value="pie"
                            className="flex items-center gap-2"
                        >
                            <PieChartIcon className="w-4 h-4" />
                            Pie Chart
                        </TabsTrigger>
                        <TabsTrigger
                            value="trend"
                            className="flex items-center gap-2"
                        >
                            <TrendingUp className="w-4 h-4" />
                            Trend
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="bar" className="space-y-4">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 60,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#E2E8F0"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        fontSize={12}
                                        stroke="#64748B"
                                    />
                                    <YAxis stroke="#64748B" fontSize={12} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="value"
                                        radius={[4, 4, 0, 0]}
                                        fill="#3B82F6"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    entry.isSelected
                                                        ? '#10B981'
                                                        : entry.color
                                                }
                                                stroke={
                                                    entry.isSelected
                                                        ? '#059669'
                                                        : 'none'
                                                }
                                                strokeWidth={
                                                    entry.isSelected ? 2 : 0
                                                }
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>

                    <TabsContent value="pie" className="space-y-4">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        innerRadius={40}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                stroke={
                                                    entry.isSelected
                                                        ? '#059669'
                                                        : 'none'
                                                }
                                                strokeWidth={
                                                    entry.isSelected ? 3 : 0
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomPieTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legend */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {chartData.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="truncate">
                                        {item.fullName}
                                    </span>
                                    <span className="text-slate-500 ml-auto">
                                        {item.percentage}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="trend" className="space-y-4">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 60,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#E2E8F0"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        fontSize={12}
                                        stroke="#64748B"
                                    />
                                    <YAxis stroke="#64748B" fontSize={12} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        dot={{
                                            fill: '#3B82F6',
                                            strokeWidth: 2,
                                            r: 6,
                                        }}
                                        activeDot={{
                                            r: 8,
                                            stroke: '#3B82F6',
                                            strokeWidth: 2,
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {totalVotes}
                        </div>
                        <div className="text-sm text-slate-600">
                            Total Votes
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {options.length}
                        </div>
                        <div className="text-sm text-slate-600">Options</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {Math.max(...Object.values(voteResults), 0)}
                        </div>
                        <div className="text-sm text-slate-600">Top Votes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {totalVotes > 0
                                ? Math.round(
                                      (Math.max(
                                          ...Object.values(voteResults),
                                          0
                                      ) /
                                          totalVotes) *
                                          100
                                  )
                                : 0}
                            %
                        </div>
                        <div className="text-sm text-slate-600">Leading</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
