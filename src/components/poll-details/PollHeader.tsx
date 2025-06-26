import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Users, Clock, CheckCircle } from 'lucide-react';

interface PollHeaderProps {
    question: string;
    totalVotes: number;
    activeViewers: number;
    endsAt: string | null;
    isPollEnded: boolean;
    onShare: () => void;
}

export default function PollHeader({
    question,
    totalVotes,
    activeViewers,
    endsAt,
    isPollEnded,
    onShare,
}: PollHeaderProps) {
    const formatTimeRemaining = (endDate: string) => {
        const now = new Date();
        const end = new Date(endDate);
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) return 'Ended';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h remaining`;
        if (hours > 0) return `${hours}h ${minutes}m remaining`;
        return `${minutes}m remaining`;
    };

    return (
        <Card className="bg-white/90 shadow-xl backdrop-blur-sm mb-8 border-0">
            <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                            {question}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4">
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-2 px-3 py-1"
                            >
                                <Users className="w-4 h-4" />
                                {totalVotes}{' '}
                                {totalVotes === 1 ? 'vote' : 'votes'}
                            </Badge>

                            <Badge
                                variant="outline"
                                className="flex items-center gap-2 px-3 py-1"
                            >
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                {activeViewers} viewing
                            </Badge>

                            {endsAt && (
                                <Badge
                                    variant={
                                        isPollEnded ? 'destructive' : 'default'
                                    }
                                    className="flex items-center gap-2 px-3 py-1"
                                >
                                    {isPollEnded ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <Clock className="w-4 h-4" />
                                    )}
                                    {formatTimeRemaining(endsAt)}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <Button
                        onClick={onShare}
                        variant={'gradient'}
                    >
                        <Share2 className="w-4 h-4" />
                        Share Poll
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
