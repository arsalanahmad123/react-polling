import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Trophy, Medal, Award } from 'lucide-react';

interface ResultsListProps {
    options: string[];
    voteResults: { [key: number]: number };
    selectedOptions: number[];
    totalVotes: number;
}

export default function PollResults({
    options,
    voteResults,
    selectedOptions,
    totalVotes,
}: ResultsListProps) {
    const sortedResults = options
        .map((option, index) => ({
            option,
            index,
            votes: voteResults[index] || 0,
            percentage:
                totalVotes > 0
                    ? ((voteResults[index] || 0) / totalVotes) * 100
                    : 0,
            isSelected: selectedOptions.includes(index),
        }))
        .sort((a, b) => b.votes - a.votes);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 0:
                return <Trophy className="w-5 h-5 text-yellow-500" />;
            case 1:
                return <Medal className="w-5 h-5 text-gray-400" />;
            case 2:
                return <Award className="w-5 h-5 text-amber-600" />;
            default:
                return (
                    <div className="w-5 h-5 flex items-center justify-center text-slate-500 font-bold">
                        {rank + 1}
                    </div>
                );
        }
    };

    return (
        <Card className="bg-white/90 shadow-lg backdrop-blur-sm border-0">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Detailed Results
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {sortedResults.map((result, rank) => (
                    <div
                        key={result.index}
                        className={`p-4 rounded-lg border-2 transition-all ${
                            result.isSelected
                                ? 'border-green-500 bg-green-50'
                                : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                {getRankIcon(rank)}
                                <span className="font-medium text-slate-900">
                                    {result.option}
                                </span>
                                {result.isSelected && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-green-100 text-green-800"
                                    >
                                        Your Vote
                                    </Badge>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-lg text-slate-900">
                                    {result.votes}
                                </div>
                                <div className="text-sm text-slate-600">
                                    {result.percentage.toFixed(1)}%
                                </div>
                            </div>
                        </div>

                        <Progress
                            value={result.percentage}
                            className="h-3"
                            style={{
                                background: result.isSelected
                                    ? '#dcfce7'
                                    : '#f1f5f9',
                            }}
                        />
                    </div>
                ))}

                {totalVotes === 0 && (
                    <div className="text-center py-8 text-slate-500">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="text-lg font-medium">No votes yet</p>
                        <p className="text-sm">Be the first to vote!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
